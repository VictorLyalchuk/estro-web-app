import { AcademicCapIcon, BanknotesIcon, CheckBadgeIcon, ClockIcon, DocumentChartBarIcon, ReceiptRefundIcon, XCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { IAuthReducerState } from '../../../store/accounts/AuthReducer'
import { APP_ENV } from '../../../env/config'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getProductQuantity } from '../../../services/product/product-services'
import { getUsersQuantity } from '../../../services/accounts/account-services'
import { getOrderQuantity, getOrdersByPage } from '../../../services/order/order-services'
import { IOrderItemsAdmin } from '../../../interfaces/Order/IOrderItemsAdmin'
import { getLocalizedField } from '../../../utils/localized/localized'
import Invoice from '../orders/Invoice'
import { getReviewByPage } from '../../../services/userProductReview/user-product-review-services'
import { StarIcon } from '@heroicons/react/24/solid'
import { formatDateWithTime } from '../../../services/custom/format-data'
import Loader from '../../../common/Loader/loader'

export default function AdminPanelPage() {
  const baseUrl = APP_ENV.BASE_URL;
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useSelector((redux: any) => redux.auth as IAuthReducerState);
  const stepQuick = [0];
  const page = 1;
  const itemsPerPage = 3;
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [step] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [orderItems, setOrderItems] = useState<IOrderItemsAdmin[]>([]);
  const [orderReview, setReviewItems] = useState<IUserProductReview[]>([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState<IOrderItemsAdmin | null>(null);
  const [modalVisiblePrintOrder, setModalVisiblePrintOrder] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: t('Product_Count'), value: productsCount },
    { label: t('Orders_Count'), value: ordersCount },
    { label: t('Users_Count'), value: usersCount },
  ]

  const actions = [
    {
      id: 1,
      icon: DocumentChartBarIcon,
      name: t('Orders_Placed_Orders'),
      href: '/admin/orders/placed-orders',
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-50',
      descriptions: t('Placed_Orders_descriptions'),
    },
    {
      id: 2,
      icon: ClockIcon,
      name: t('Orders_Order_processing'),
      href: '/admin/orders/order-processing',
      iconForeground: 'text-orange-700',
      iconBackground: 'bg-orange-50',
      descriptions: t('Order_processing_descriptions'),
    },
    {
      id: 3,
      icon: RocketLaunchIcon,
      name: t('Orders_Shipped_Orders'),
      href: '/admin/orders/shipped-orders',
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-50',
      descriptions: t('Order_shipped_descriptions'),
    },
    {
      id: 4,
      icon: CheckBadgeIcon,
      name: t('Orders_Delivered_Orders'),
      href: '/admin/orders/delivered-orders',
      iconForeground: 'text-green-700',
      iconBackground: 'bg-green-50',
      descriptions: t('Order_delivered_descriptions'),
    },
    {
      id: 5,
      icon: XCircleIcon,
      name: t('Orders_Cancelled_Orders'),
      href: '/admin/orders/cancelled-orders',
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-50',
      descriptions: t('Order_cancelled_descriptions'),
    },
    {
      id: 6,
      icon: ReceiptRefundIcon,
      name: t('Orders_Returned_Orders'),
      href: '/admin/orders/returned-orders',
      iconForeground: 'text-gray-700',
      iconBackground: 'bg-gray-50',
      descriptions: t('Order_returned_descriptions'),
    },
    {
      id: 7,
      icon: BanknotesIcon,
      name: t('Sales_Report'),
      href: '/admin/report/financial-reports',
      iconForeground: 'text-rose-700',
      iconBackground: 'bg-rose-50',
      descriptions: t('Order_sales_descriptions'),
    },
    {
      id: 8,
      icon: AcademicCapIcon,
      name: t('Product_Report'),
      href: '#',
      iconForeground: 'text-indigo-700',
      iconBackground: 'bg-indigo-50',
      descriptions: t('Order_product_descriptions'),
    },
  ]

  useEffect(() => {
    getProductQuantity('')
      .then(data => setProductsCount(data))
      .catch(error => console.error('Error fetching product quantity data:', error));
    getUsersQuantity()
      .then(data => setUsersCount(data))
      .catch(error => console.error('Error fetching user quantity data:', error));
    getOrderQuantity(step).then(data => setOrdersCount(data))
      .catch(error => console.error('Error fetching orders quantity data:', error));
    getOrdersByPage(page, itemsPerPage, stepQuick).then(data => setOrderItems(data)).then(() => {
      setLoading(false);
    }).catch(error => console.error('Error fetching orders data:', error));
    getReviewByPage(page, itemsPerPage).then(data => setReviewItems(data)).then(() => {
      setLoading(false);
    }).catch(error => console.error('Error fetching Review data:', error));
  }, []);

  const handleOpenModal = (orderItem: IOrderItemsAdmin) => {
    setSelectedOrderItem(orderItem);
    setModalVisiblePrintOrder(true);
  };

  return (
    <>
      <div className="min-h-full">
        <main className="-mt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-screen-2xl lg:px-8">
            <h1 className="sr-only">{t('Admin_Profile')}</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      {t('Admin_Profile_Overview')}
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="flex-shrink-0">
                            <img className="mx-auto h-20 w-20 rounded-full" src={`${baseUrl}/uploads/${user?.ImagePath || "user404.webp"}`} alt="" />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">{t('Admin_Welcome_back')}</p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user?.FirstName} {user?.LastName}</p>
                            <p className="text-sm font-medium text-gray-600">{user?.Role}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <Link
                            to={'/account/profile'}
                            className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  hover:text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {t('Admin_View_profile')}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      {stats.map((stat) => (
                        <div key={stat.label} className="px-6 py-5 text-center text-sm font-medium">
                          <span className="text-gray-900">{stat.value}</span>{' '}
                          <span className="text-gray-600">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section aria-labelledby="quick-links-title">
                {/* <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 text-gray-700 mx-auto max-w-7xl  ">
                    <h2 className="sr-only" id="quick-links-title">
                      {t('Admin_Quick_links')}
                    </h2>
                    {actions.map((action, actionIdx) => (
                      <div
                        key={action.id}
                        className={classNames(
                          // actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                          // actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                          // actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                          // actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                          'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-100 hover:text-indigo-500 transform transition-transform duration-300 hover:scale-105',
                          actionIdx % 2 === 0 ? 'hover:z-20' : 'hover:z-10',
                          'rounded-md p-6 shadow-md'
                        )}
                      >
                        <div>
                          <span
                            className={classNames(
                              action.iconBackground,
                              action.iconForeground,
                              'inline-flex rounded-lg p-3 ring-4 ring-white'
                            )}
                          >
                            <action.icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="mt-8">
                          <h3 className="text-lg font-medium">
                            <Link to={action.href} className="focus:outline-none">
                              {/* Extend touch target to entire panel */}
                              <span className="absolute inset-0" aria-hidden="true" />
                              {action.name}
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {action.descriptions}
                          </p>
                        </div>
                        <span
                          className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                          aria-hidden="true"
                        >
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Reviews */}
                <section aria-labelledby="announcements-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900" id="announcements-title">
                        {t('Recent Reviews')}
                      </h2>
                      <div className="mt-6 flow-root">
                        <ul role="list" className="-my-5 divide-y divide-gray-200 relative">
                          {loading ? (
                            <div className="min-h-[162px]">
                              <Loader />
                            </div>
                          ) : (
                            orderReview.map((review, index) => (
                              <li key={index} className="py-5 relative transform transition-transform duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <img src={`${baseUrl}/uploads/${review?.avatar || "user404.webp"}`} className="h-8 rounded-full" />
                                  </div>
                                  <div className="relative flex-grow focus-within:ring-2 focus-within:ring-indigo-500">
                                    <h3 className="text-sm font-semibold text-gray-800">
                                      <Link to={`/product/${review.productId}`} className="focus:outline-none">
                                        {/* Extend touch target to entire panel */}
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        {review.author}
                                      </Link>
                                    </h3>
                                    <div className="mt-1 flex items-center">
                                      {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                          key={rating}
                                          className={classNames(
                                            review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                            'h-5 w-5 flex-shrink-0'
                                          )}
                                          aria-hidden="true"
                                        />
                                      ))}
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{review.content}</p>
                                  </div>
                                  <div className="ml-auto">
                                    <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                                      {new Date(review.orderDate).toLocaleDateString()}
                                    </div>
                                    <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                                      {formatDateWithTime(review.orderDate)}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <Link
                          to="/admin/review/review-list"
                          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  hover:text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {t('Admin_View_all')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recent Orders */}
                <section aria-labelledby="recent-hires-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900" id="recent-hires-title">
                        {t('Admin_Recent_Orders')}
                      </h2>
                      <div className="mt-6 flow-root">
                        <ul role="list" className="-my-5 divide-y divide-gray-200 relative">
                          {loading ? (
                            <div className="min-h-[162px]">
                              <Loader />
                            </div>
                          ) : (
                            orderItems.map((item) => (
                              <li key={item.id} className="py-4 relative transform transition-transform duration-300 hover:scale-105">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <img src={`${baseUrl}/uploads/1200_${item.imagePath || '/uploads/default.jpg'}`} className="h-14" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <Link to={`/product/${item.productId}`} className="focus:outline-none">
                                      <p className="truncate text-sm font-medium text-gray-900">{getLocalizedField(item, 'name', lang)}</p>
                                      <p className="truncate text-sm text-gray-500">{item.price} €</p>
                                      <p className="truncate text-sm text-gray-500">{t('Orders_Quantity') + ': ' + item.quantity}</p>
                                    </Link>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() => handleOpenModal(item)}
                                      className="inline-flex items-center rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
                                    >
                                      {t('Admin_View')}
                                    </button>
                                  </div>
                                </div>
                              </li>
                            )))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <Link
                          to="/admin/orders/placed-orders"
                          className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50  hover:text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          {t('Admin_View_all')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Invoice
          isOpen={modalVisiblePrintOrder}
          setOpen={setModalVisiblePrintOrder}
          orderItem={selectedOrderItem}
        />
      </div>
    </>
  )
}