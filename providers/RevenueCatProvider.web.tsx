import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import { Purchases, Package, ErrorCode, PurchasesError } from '@revenuecat/purchases-js';
import { useUser } from '@clerk/clerk-expo';
import { RevenueCatProps } from '@/providers/RevenueCat';

// Use your RevenueCat API keys
const APIKeys = {
  web: process.env.EXPO_PUBLIC_REVENUECAT_WEB_KEY as string,
};

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

export const RevenueCatProvider = ({ children }: any) => {
  const [webPackages, setWebPackages] = useState<Package[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { user: clerkUser } = useUser();

  useEffect(() => {
    const init = async () => {
      Purchases.configure(APIKeys.web, clerkUser!.id);
      setIsReady(true);

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
      console.log('offerings', offerings.current.availablePackages);
      setWebPackages(offerings.current.availablePackages);
    }
  };

  // Purchase a package
  const purchaseWebPackage = async (pack: Package) => {
    try {
      return await Purchases.getSharedInstance().purchase({
        rcPackage: pack,
        customerEmail: clerkUser!.emailAddresses[0].emailAddress,
      });
    } catch (e) {
      if (e instanceof PurchasesError && e.errorCode == ErrorCode.UserCancelledError) {
        // User cancelled the purchase process, don't do anything
      } else {
        // Handle errors
        console.log('error', e);
        throw e;
      }
    }
  };

  const value = {
    webPackages,
    purchaseWebPackage,
  };

  // Return empty fragment if provider is not ready (Purchase not yet initialised)
  if (!isReady) return <></>;

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};

// Export context for easy usage
export const useRevenueCat = () => {
  return useContext(RevenueCatContext) as RevenueCatProps;
};
