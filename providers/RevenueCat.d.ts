export interface RevenueCatProps {
  purchasePackage?: (pack: PurchasesPackage) => Promise<MakePurchaseResult>;
  purchaseWebPackage?: (pack: Package) => Promise<MakePurchaseResult>;
  restorePermissions?: () => Promise<CustomerInfo>;
  packages?: PurchasesPackage[];
  webPackages?: Package[];
}
