import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import { Purchases, Package, ErrorCode, PurchasesError } from '@revenuecat/purchases-js';
import { useUser } from '@clerk/clerk-expo';

// Use your RevenueCat API keys
const APIKeys = {
  web: process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY as string,
};

interface RevenueCatProps {
  purchasePackage?: (pack: Package) => Promise<void>;
  user: UserState;
  packages: Package[];
}

export interface UserState {
  courses: string[];
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const RevenueCatProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserState>({ courses: [] });
  const [packages, setPackages] = useState<Package[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { user: clerkUser } = useUser();

  useEffect(() => {
    const init = async () => {
      console.log('WEB INIT');

      Purchases.configure(APIKeys.web, clerkUser!.id);
      setIsReady(true);

      try {
        const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
        console.log('customerInfo', customerInfo);
        if ('Advanced Yoga Mastery' in customerInfo.entitlements.active) {
          // Grant user access to the entitlement "gold_entitlement"
          setUser({
            courses: [customerInfo.entitlements.active['Advanced Yoga Mastery'].identifier],
          });
        }
        // access latest customerInfo
      } catch (e) {
        // Handle errors fetching customer info
      }

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Load all offerings a user can (currently) purchase
  const loadOfferings = async () => {
    const offerings = await Purchases.getSharedInstance().getOfferings();
    console.log('🚀 ~ loadOfferings ~ offerings:', offerings);
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      console.log('offerings', offerings.current);
      setPackages(offerings.current.availablePackages);
    }
  };

  // Update user state based on previous purchases
  // const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
  //   const newUser: UserState = { courses: [] };

  //   if (customerInfo?.entitlements.active['Advanced Yoga Mastery'] !== undefined) {
  //     console.log('customerInfo?.entitlements.active', customerInfo?.entitlements.active);
  //     newUser.courses.push(customerInfo?.entitlements.active['Advanced Yoga Mastery'].identifier);
  //   }

  //   setUser(newUser);
  // };

  // Purchase a package
  const purchasePackage = async (pack: Package) => {
    try {
      const { customerInfo } = await Purchases.getSharedInstance().purchase({
        rcPackage: pack,
      });
      if (Object.keys(customerInfo.entitlements.active).includes('Advanced Yoga Mastery')) {
        // Unlock that great "pro" content
      }
    } catch (e) {
      if (e instanceof PurchasesError && e.errorCode == ErrorCode.UserCancelledError) {
        // User cancelled the purchase process, don't do anything
      } else {
        // Handle errors
        console.log('error', e);
      }
    }
  };

  const value = {
    user,
    packages,
    purchasePackage,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};
