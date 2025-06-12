import { Link } from "react-router-dom";
import GoodsNotFound from "../../../../assets/goods-not-found.png";
import { APP_ENV } from "../../../../env/config";
import React from 'react';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { OrdersProps } from "../../../../interfaces/ProfileUser/ProfileUserProps";
import { XMarkIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../../../services/custom/format-data";
import { useTranslation } from "react-i18next";
import { getLocalizedField } from "../../../../utils/localized/localized";
import classNames from "classnames";
import { infoPaymentList } from "../../../../data/infoPaymentList";
import { Link as Scrollink } from 'react-scroll'
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Orders: React.FC<OrdersProps> = ({ orders, onViewModeChange, page, countPage, onPageChange }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = APP_ENV.BASE_URL;
  const itemsPerPage = 1;
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(countPage / itemsPerPage);
  const visiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  return (
    <>
      {orders && orders.length > 0 ? (
        <>
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-md shadow-md mb-8 mt-8 order-start">
              <div className="mx-auto max-w-2xl pb-8 pt-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8 ">
                <div className="flex justify-between space-y-2 px-4 border-b border-gray-200 pb-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                  <div className="grid grid-rows-1 px-4 py-6 sm:p-6 lg:pb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">{t('Order_OrderDetails')}</h1>
                    <dl className="flex mt-2">
                      <dt className="text-gray-500">{t('Order_Order')} #&nbsp;</dt>
                      <dd className="font-medium text-gray-900">{order.id}</dd>
                      <dt>
                        <span className="sr-only">{t('Order_Date')}</span>
                        <span className="mx-2 text-gray-400" aria-hidden="true">
                          &middot;
                        </span>
                      </dt>
                      <dd className="font-medium text-gray-900">
                        <time>{formatDate(order.orderDate, lang)}</time>
                      </dd>
                    </dl>
                  </div>

                  <div className="flex sm:items-start sm:space-x-4 px-4 py-6 sm:p-6 lg:pb-8">
                    <button onClick={onViewModeChange} className="text-gray-400 hover:text-indigo-600">
                      <span className="sr-only">{t('Order_ViewGrid')}</span>
                      <ArrowsPointingInIcon className="h-7 w-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <section aria-labelledby="products-heading" className="mt-4">
                  <h2 id="products-heading" className="sr-only">
                    {t('Order_ProductsPurchased')}
                  </h2>

                  <div className="space-y-24">
                    {order.orderItems.map((product, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                      >
                        <div className="px-4 py-6 sm:col-span-4 md:col-span-5 md:row-span-2 md:row-end-2">
                          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-50">
                            {product.imagePath && product.imagePath.length > 0 ? (
                              <img
                                src={`${baseUrl}/uploads/1200_${product?.imagePath || '/uploads/default.jpg'}`}
                                className="object-cover object-center" />
                            ) : (
                              <img
                                src={`${baseUrl}/uploads/imagenot.webp`}
                                alt="Image Not Available"
                                className="object-cover object-center"
                              />
                            )}
                          </div>
                        </div>
                        <div className="px-4 py-6 mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${product.productId}`}>{getLocalizedField(product, 'name', lang)}</Link>
                          </h3>
                          <p className="mt-3 font-medium text-gray-900">{t('Order_Article')}: {product.article}</p>
                          <p className="mt-3 font-medium text-gray-900">{product.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
                          <p className="mt-3 font-medium text-gray-900">{t('Order_Quantity')}: {product.quantity}</p>
                          <p className="mt-3 font-medium text-gray-900 ">{t('Order_Size')}: {product.size}</p>
                          {/* <p className="mt-3 text-gray-500">{getLocalizedField(product, 'description', lang)}</p> */}
                        </div>
                        <div className="px-4 py-6 sm:col-span-12 md:col-span-7">
                          <dl className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                            <div>
                              <dt className="font-medium text-gray-900">{t('Order_DeliveryAddress')}</dt>
                              <dd className="mt-3 text-gray-500">
                                <span className="block">{order.address.region}</span>
                                <span className="block">{order.address.city}</span>
                                <span className="block">{order.address.street}</span>
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium text-gray-900">{t('Order_Contacts')}</dt>
                              <dd className="mt-3 space-y-3 text-gray-500">
                                <p>{order.email}</p>
                                <p>{order.phoneNumber}</p>
                              </dd>
                            </div>
                          </dl>
                          <p className="mt-6 font-medium text-gray-900 md:mt-10">
                            {product.dueDate === '0001-01-01T00:00:00'
                              ? t('Order_DateNotDetermined')
                              : `${t(product.status)}`} {t('on')}
                            {product.dueDate !== '0001-01-01T00:00:00' && (
                              <time>{formatDate(order.orderDate, lang)}</time>
                              // <time dateTime={product.dueDate}>{formatDate(product.dueDate)}</time>
                            )}
                          </p>
                          <div className="mt-6">
                            {product.step > 3 && product.step < 5 ? (
                              <div className="text-red-600 text-center font-medium flex items-center">
                                <XMarkIcon className="w-6 h-6 mr-2" />
                                {t('Order_Cancelled')}
                              </div>
                            ) : product.step >= 5 ? (
                              <div className="text-gray-600 text-center font-medium flex items-center">
                                <ArrowUturnLeftIcon className="w-6 h-6 mr-2" />
                                {t('Returned')}
                              </div>
                            ) : (
                              <>
                                <div className="overflow-hidden rounded-full bg-gray-200">
                                  <div
                                    className="h-2 rounded-full bg-indigo-600"
                                    // style={{ width: `calc((${product.step} * 2 + 1) / 8 * 100%)` }}
                                    style={{
                                      width: product.step === 3
                                        ? '100%'
                                        : `calc((${product.step} * 2 + 1) / 8 * 100%)`
                                    }}
                                  />
                                </div>
                                <div className="mt-6 hidden grid-cols-4 font-medium text-gray-600 sm:grid">
                                  <div className="text-indigo-600">{t('Order_OrderPlaced')}</div>
                                  <div className={classNames(product.step > 0 ? 'text-indigo-600' : '', 'text-center')}>
                                    {t('Order_Processing')}
                                  </div>
                                  <div className={classNames(product.step > 1 ? 'text-indigo-600' : '', 'text-center')}>
                                    {t('Order_Shipped')}
                                  </div>
                                  <div className={classNames(product.step > 2 ? 'text-indigo-600' : '', 'text-right')}>
                                    {t('Order_Delivered')}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Billing */}
                <section aria-labelledby="summary-heading" className="mt-24">
                  <h2 id="summary-heading" className="sr-only">
                    {t('Order_BillingSummary')}
                  </h2>

                  <div className="rounded-lg bg-gray-50 px-6 py-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-0 lg:py-8">
                    <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-5 lg:pl-8">
                      <div>
                        <dt className="font-medium text-gray-900">{t('Order_BillingPerson')}</dt>
                        <dd className="mt-3 text-gray-500">
                          <span className="block">{order.firstName}</span>
                          <span className="block">{order.lastName}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-900">{t('Order_PaymentInformation')}</dt>
                        <dd className="mt-3 flex">
                          <div>
                            {infoPaymentList.find(info => info.id === orders[0].orderItems[0].orderPayment.paymentMethod)?.logo || null}

                            <p className="sr-only">{orders[0].orderItems[0].orderPayment.paymentMethod}</p>
                          </div>
                          <div className="ml-4">
                            <p> <span className="text-gray-600"> {t('Order_EndingWith')} </span>
                              <span className="text-gray-900 font-medium ">{orders[0].orderItems[0].orderPayment.cardNumber.slice(-4)}</span></p>
                            <p> <span className="text-gray-600"> {t('Order_Expires')} </span>
                              <span className="text-gray-900 font-medium ">{orders[0].orderItems[0].orderPayment.cardMonthExpires} / {orders[0].orderItems[0].orderPayment.cardYearExpires.slice(-2)}</span></p>
                          </div>
                        </dd>
                      </div>
                    </dl>

                    <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-7 lg:mt-0 lg:pr-8">
                      <div className="flex items-center justify-between pb-4">
                        <dt className="text-gray-600">{t('Order_Subtotal')}</dt>
                        <dd className="font-medium text-gray-900">{order.subtotal.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">{t('Order_Tax')}</dt>
                        <dd className="font-medium text-gray-900">{order.tax.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">{t('Order_Discount')}</dt>
                        <dd className="font-medium text-red-600">{order.discount.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <dt className="font-medium text-gray-900">{t('Order_OrderTotal')}</dt>
                        <dd className="font-medium text-indigo-600">{order.orderTotal.toLocaleString('uk-UA', { minimumFractionDigits: 2 }).slice(0, -1)} €</dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>
            </div>
          ))}

          <nav className="flex items-center justify-center bg-white rounded-md shadow-md bg-white px-4 py-3 sm:px-6">
            <div className="container mx-auto p-4 flex relative max-w-screen-2xl lg:flex-row justify-center ">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                <div>
                  <p className="text-sm text-gray-700">
                    {t('Order_Showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('Order_To')}{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, countPage)}</span> {t('Order_Of')}{' '}
                    <span className="font-medium">{countPage}</span> {t('Order_Results')}
                  </p>
                </div>
              </div>
              <div>
                <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                  <div className="flex flex-1 justify-between sm:justify-end">
                    <Scrollink to="order-start" smooth={true}>
                      <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                    ${page === 1
                            ? 'text-gray-300'
                            : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                          }`}
                      >
                        <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {t('Order_Previous')}
                      </button>
                    </Scrollink>

                    <div className="hidden lg:block">
                      <Scrollink to="order-start" smooth={true}>
                        <button
                          onClick={() => onPageChange(1)}
                          disabled={page === 1}
                          className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium 
                                                ${page === 1
                              ? 'text-gray-300'
                              : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                            }`}
                        >
                          {t('Begin')}
                        </button>
                      </Scrollink>
                    </div>

                    {[...Array(endPage - startPage + 1)].map((_, index) => {
                      const pageNumber = startPage + index;
                      return (
                        <Scrollink to="order-start" smooth={true} key={pageNumber}>
                          <button
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                            className={`inline-flex items-center border-t px-4 pt-4 text-sm font-medium text-gray-500 ${page === pageNumber
                              ? 'border-t-2 border-indigo-500 text-indigo-600 font-semibold'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        </Scrollink>
                      );
                    })}

                    <div className="hidden lg:block">
                      <Scrollink to="order-start" smooth={true}>
                        <button
                          onClick={() => onPageChange(totalPages)}
                          disabled={page >= totalPages}
                          className={`inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium 
                                                    ${page >= totalPages
                              ? 'text-gray-300'
                              : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                            }`}
                        >
                          {t('End')}
                        </button>
                      </Scrollink>
                    </div>

                    <Scrollink to="order-start" smooth={true}>
                      <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={indexOfLastItem >= countPage}
                        className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium 
                    ${indexOfLastItem >= countPage
                            ? 'text-gray-300'
                            : 'text-gray-900 hover:border-indigo-500 hover:text-indigo-500'
                          }`}
                      >
                        {t('Order_Next')}
                        <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      </button>
                    </Scrollink>

                  </div>
                </nav>
              </div>
            </div>
          </nav>
        </>
      ) : (
        <div className="container mx-auto p-8 flex justify-center relative bg-gray-100 mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2   flex-col lg:flex-row  ">
          <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
            <div className="mt-8 flex justify-center">
              <img src={GoodsNotFound}></img>
            </div>
            <div className="mt-8 flex justify-center">
              <p>{t('Order_NoOrders')}</p>
            </div>
          </div>
        </div>

      )}
    </>
  )
}
export default Orders;