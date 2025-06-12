import { Route, Routes } from "react-router-dom";
import Page404 from "./components/notFound/Page404";
import Logo from "./components/logo/Logo";
import Bag from "./components/navbars/navbarsPages/bag/Bag";
import Product from "./components/user/product/Product.tsx";
import CatalogNavigation from "./components/user/catalog/CatalogNavigation.tsx";
import NavbarsPage from "./components/navbars/NavbarsPage";
import { useEffect, useState } from "react";
import Loader from "./common/Loader";
import { Toaster } from 'react-hot-toast';
import AdminPanelPage from "./components/admin/adminPanel/AdminPanelPage.tsx";
import AddStorage from "./components/admin/product/AddStorage";
import OurBrand from "./components/footer/footerPages/OurBrand";
import Footer from "./components/footer/FooterPage";
import DeliveryandPayment from "./components/footer/footerPages/DeliveryAndPayment";
import ReturnExchange from "./components/footer/footerPages/ReturnExchange";
import WarrantyProductCare from "./components/footer/footerPages/WarrantyProductCare";
import PrivacyPolicy from "./components/footer/footerPages/PrivacyPolicy";
import About from "./components/footer/footerPages/About";
import StoreLocations from "./components/footer/footerPages/StoreLocations";
import AdminLayout from "./components/layout/AdminLayout";
import AuthPanelPage from "./components/navbars/navbarsPages/auth/AuthPanelPage";
import UserPanelPage from "./components/user/userPanel/UserPanelPage";
import UserLayout from "./components/layout/UserLayout";
import GuestLayout from "./components/layout/GuestLayout";
import HomeStore from "./components/homePage/HomeStore";
import CatalogHome from "./components/user/catalog/CatalogHome.tsx";
import useAuthTokenEffect from "./useAuthTokenEffect";
import useGetFavoritesEffect from "./useGetFavoritesEffect";
import './i18n/i18n.ts';
import GeneralLayout from "./components/layout/GeneralLayout.tsx";
import ProductList from "./components/admin/product/ProductList.tsx";
import AdminHeader from "./components/admin/adminPanel/AdminHeader.tsx";
import AddProductPanelPage from "./components/admin/product/add-product/AddProductPanelPage.tsx";
import EditPanelPage from "./components/admin/product/edit-product/EditPanelPage.tsx";
import MainCategoryList from "./components/admin/main-category/MainCategoryList.tsx";
import AddMainCategoryPanelPage from "./components/admin/main-category/add-main-category/AddMainCategoryPanelPage.tsx";
import EditMainCategoryPanelPage from "./components/admin/main-category/edit-main-category/EditMainCategoryPanelPage.tsx";
import SubCategoryList from "./components/admin/sub-category/SubCategoryList.tsx";
import AddSubCategoryPanelPage from "./components/admin/sub-category/add-sub-category/AddSubCategoryPanelPage.tsx";
import EditSubCategoryPanelPage from "./components/admin/sub-category/edit-sub-category/EditSubCategoryPanelPage.tsx";
import CategoryList from "./components/admin/category/CategoryList.tsx";
import AddCategoryPanelPage from "./components/admin/category/add-category/AddCategoryPanelPage.tsx";
import EditCategoryPanelPage from "./components/admin/category/edit-category/EditCategoryPanelPage.tsx";
import UserList from "./components/admin/user/UserList.tsx";
import AddUser from "./components/admin/user/AddUser.tsx";
import EditUser from "./components/admin/user/EditUser.tsx";
import StoreList from "./components/admin/store/StoreList.tsx";
import AddStorePanelPage from "./components/admin/store/add-store/AddStorePanelPage.tsx";
import EditStorePanelPage from "./components/admin/store/edit-store/EditStorePanelPage.tsx";
import OrderItemsList from "./components/admin/orders/OrderItemsList.tsx";
import { t } from "i18next";
import ReviewList from "./components/admin/review/ReviewList.tsx";
import FinancialReports from "./components/admin/report/finance-report/FinancialReports.tsx";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useAuthTokenEffect()
  useGetFavoritesEffect();

  return loading ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <Toaster position="top-right" reverseOrder={false} containerClassName="overflow-auto" />
      <Routes>
        {/* Гостьові маршрути */}
        <Route element={<><Logo /><NavbarsPage /><GuestLayout /><Footer /></>}>
          <Route path='/auth' element={<AuthPanelPage />} />
          <Route path="/auth/:email/:token" element={<AuthPanelPage />} />
        </Route>

        {/* Адміністраторські маршрути без Logo, NavbarsPage і Footer */}
        <Route path="/admin" element={<><AdminHeader /><AdminLayout /></>}>
          <Route path="/admin/*" element={<Page404 />} />
          <Route path="admin-panel-page" element={<AdminPanelPage />} />
          <Route path="report/financial-reports" element={<FinancialReports />} />

          <Route path="product/product-list" element={<ProductList />} />
          <Route path="product/product-list/search/:text" element={<ProductList />} />
          <Route path="product/add-product-en" element={<AddProductPanelPage />} />
          <Route path="product/add-product-uk" element={<AddProductPanelPage />} />
          <Route path="product/add-product-es" element={<AddProductPanelPage />} />
          <Route path="product/add-product-fr" element={<AddProductPanelPage />} />
          <Route path="product/edit-product-en/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-uk/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-es/:Id" element={<EditPanelPage />} />
          <Route path="product/edit-product-fr/:Id" element={<EditPanelPage />} />
          <Route path="product/add-storage/:Id" element={<AddStorage />} />

          <Route path="main-category/main-category-list" element={<MainCategoryList />} />
          <Route path="main-category/add-main-category-en" element={<AddMainCategoryPanelPage />} />
          <Route path="main-category/add-main-category-uk" element={<AddMainCategoryPanelPage />} />
          <Route path="main-category/add-main-category-es" element={<AddMainCategoryPanelPage />} />
          <Route path="main-category/add-main-category-fr" element={<AddMainCategoryPanelPage />} />
          <Route path="main-category/edit-main-category-en/:Id" element={<EditMainCategoryPanelPage />} />
          <Route path="main-category/edit-main-category-uk/:Id" element={<EditMainCategoryPanelPage />} />
          <Route path="main-category/edit-main-category-es/:Id" element={<EditMainCategoryPanelPage />} />
          <Route path="main-category/edit-main-category-fr/:Id" element={<EditMainCategoryPanelPage />} />

          <Route path="sub-category/sub-category-list" element={<SubCategoryList />} />
          <Route path="sub-category/add-sub-category-en" element={<AddSubCategoryPanelPage />} />
          <Route path="sub-category/add-sub-category-uk" element={<AddSubCategoryPanelPage />} />
          <Route path="sub-category/add-sub-category-es" element={<AddSubCategoryPanelPage />} />
          <Route path="sub-category/add-sub-category-fr" element={<AddSubCategoryPanelPage />} />
          <Route path="sub-category/edit-sub-category-en/:Id" element={<EditSubCategoryPanelPage />} />
          <Route path="sub-category/edit-sub-category-uk/:Id" element={<EditSubCategoryPanelPage />} />
          <Route path="sub-category/edit-sub-category-es/:Id" element={<EditSubCategoryPanelPage />} />
          <Route path="sub-category/edit-sub-category-fr/:Id" element={<EditSubCategoryPanelPage />} />

          <Route path="category/category-list" element={<CategoryList />} />
          <Route path="category/add-category-en" element={<AddCategoryPanelPage />} />
          <Route path="category/add-category-uk" element={<AddCategoryPanelPage />} />
          <Route path="category/add-category-es" element={<AddCategoryPanelPage />} />
          <Route path="category/add-category-fr" element={<AddCategoryPanelPage />} />
          <Route path="category/edit-category-en/:Id" element={<EditCategoryPanelPage />} />
          <Route path="category/edit-category-uk/:Id" element={<EditCategoryPanelPage />} />
          <Route path="category/edit-category-es/:Id" element={<EditCategoryPanelPage />} />
          <Route path="category/edit-category-fr/:Id" element={<EditCategoryPanelPage />} />

          <Route path="user/user-list" element={<UserList />} />
          <Route path="user/add-user" element={<AddUser />}></Route>
          <Route path="user/edit-user/:Id" element={<EditUser />}></Route>

          <Route path="store/store-list" element={<StoreList />} />
          <Route path="store/add-store-en" element={<AddStorePanelPage />} />
          <Route path="store/add-store-uk" element={<AddStorePanelPage />} />
          <Route path="store/add-store-es" element={<AddStorePanelPage />} />
          <Route path="store/add-store-fr" element={<AddStorePanelPage />} />
          <Route path="store/edit-store-en/:Id" element={<EditStorePanelPage />} />
          <Route path="store/edit-store-uk/:Id" element={<EditStorePanelPage />} />
          <Route path="store/edit-store-es/:Id" element={<EditStorePanelPage />} />
          <Route path="store/edit-store-fr/:Id" element={<EditStorePanelPage />} />

          <Route path="orders/placed-orders" element={<OrderItemsList name={t('Orders_Placed_Orders')} step={[0]} />} />
          <Route path="orders/order-processing" element={<OrderItemsList name={t('Orders_Order_processing')} step={[1]} />} />
          <Route path="orders/shipped-orders" element={<OrderItemsList name={t('Orders_Shipped_Orders')} step={[2]} />} />
          <Route path="orders/delivered-orders" element={<OrderItemsList name={t('Orders_Delivered_Orders')} step={[3]} />} />
          <Route path="orders/cancelled-orders" element={<OrderItemsList name={t('Orders_Cancelled_Orders')} step={[4]} />} />
          <Route path="orders/returned-orders" element={<OrderItemsList name={t('Orders_Returned_Orders')} step={[5]} />} />

          <Route path="review/review-list" element={<ReviewList />} />

          <Route path="report/financial-reports" element={<FinancialReports/>}/>
        </Route>

        {/* Маршрути для користувачів з Logo, NavbarsPage і Footer */}
        <Route element={<><Logo /><NavbarsPage /><UserLayout /><Footer /></>}>
          <Route path="/account/*" element={<Page404 />} />
          <Route path="account/orders" element={<UserPanelPage />} />
          <Route path='account/profile' element={<UserPanelPage />} />
          <Route path='account/settings' element={<UserPanelPage />} />
          <Route path='account/favorites' element={<UserPanelPage />} />
          <Route path='account/bonuses' element={<UserPanelPage />} />
        </Route>

        {/* Загальні маршрути з Logo, NavbarsPage і Footer */}
        <Route element={<><GeneralLayout /><Footer /></>}>
          <Route path="/" element={<HomeStore />} />
          <Route path="/:email/:token" element={<HomeStore />} />
          <Route path="catalog/:subName/:urlName" element={<CatalogNavigation />} />
          <Route path="catalog/:subName" element={<CatalogNavigation />} />
          <Route path="catalog-home" element={<CatalogHome />} />
          <Route path="catalog-home/:gender" element={<CatalogHome />} />
          <Route path="catalog-home/search/:text" element={<CatalogHome />} />
          <Route path="product/:Id" element={<Product />} />
          <Route path='/bag' element={<Bag />} />
          <Route path="/delivery-and-payment" element={<DeliveryandPayment />} />
          <Route path="/return-exchange" element={<ReturnExchange />} />
          <Route path="/warranty-product-care" element={<WarrantyProductCare />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/our-brand" element={<OurBrand />} />
          <Route path="/about" element={<About />} />
          <Route path="/store-locations" element={<StoreLocations />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App