import React from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { IOrderItemsAdmin } from '../../../interfaces/Order/IOrderItemsAdmin';
import { APP_ENV } from '../../../env/config';
import { formatCardNumber } from '../../../services/custom/format-card-number';
import { formatPhoneNumber } from '../../../services/custom/format-phone-number';
import { formatDateWithTime } from '../../../services/custom/format-data';
import { OrderStatus } from '../../../interfaces/Type/OrderStatus';
import { getLocalizedField } from '../../../utils/localized/localized';

interface ShipOrderModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  orderItem: IOrderItemsAdmin | null;
}

const Invoice: React.FC<ShipOrderModalProps> = ({ isOpen, setOpen, orderItem }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = APP_ENV.BASE_URL;
 
  const handleClose = () => {
    setOpen(false);
  };

  const statusColorMapping = {
    'Order placed': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-orange-200 text-orange-800',
    'Shipped': 'bg-blue-200 text-blue-800',
    'Delivered': 'bg-green-300 text-green-800',
    'Cancelled': 'bg-red-300 text-red-800',
    'Returned': 'bg-gray-200 text-gray-800',
  };

  const getStatusColorClass = (status: string): string => {
    return statusColorMapping[status as OrderStatus] || 'bg-black-200 text-black';
  };

  const colorClass = orderItem ? getStatusColorClass(orderItem.status) : '';


  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow || !orderItem) return;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 28px;
              margin-bottom: 20px;
              color: #333333;
              border-bottom: 2px solid #e0e0e0;
              padding-bottom: 10px;
            }
            .info {
              margin-top: 20px;
            }
            .info p {
              font-size: 16px;
              margin: 8px 0;
              color: #555555;
            }
            .info p strong {
              color: #333333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Order Details</h1>
            <div class="info">
              <p><strong>${t('Orders_Order')}:</strong> #${orderItem.orderId}-${orderItem.id}</p>
              <p><strong>${t('Client')}:</strong> ${orderItem.order.firstName} ${orderItem.order.lastName}</p>
              <p><strong>${t('Phone_Number')}:</strong> ${formatPhoneNumber(orderItem.order.phoneNumber)}</p>
              <p><strong>${t('Email')}:</strong> ${orderItem.order.email}</p>
              <p><strong>${t('Orders_Product_Name')}:</strong> ${getLocalizedField(orderItem, 'name', lang)}</p>           
              <p><strong>${t('Orders_Quantity')}:</strong> ${orderItem.quantity}</p>
              <p><strong>${t('Orders_Quantity_in_stock')}:</strong> ${orderItem.product.storages?.map((storage) => {
      const isSizeMatch = String(storage.size) === String(orderItem.size);
      return isSizeMatch ? storage.productQuantity : null;
    }).filter(quantity => quantity !== null).join(', ')}</p>
              <p><strong>${t('Orders_Size')}:</strong> ${orderItem.size}</p>
              <p><strong>${t('Orders_Price')}:</strong> ${orderItem.price} €</p>
              <p><strong>${t('Orders_Date')}:</strong> ${new Date(orderItem.dueDate).toLocaleDateString()} ${formatDateWithTime(orderItem.dueDate)}</p>
              <p><strong>${t('Orders_Status')}:</strong> ${t(`${orderItem.status}`)}</p>
              <p><strong>${t('Payment')}:</strong> ${t(`${orderItem.orderPayment.payment}`)}</p>           
              <p><strong>${t('Payment_Method')}:</strong> ${orderItem.orderPayment.paymentMethod}</p>
              <p><strong>${t('Card_Number')}:</strong> ${formatCardNumber(orderItem.orderPayment.cardNumber)}</p>
              <p><strong>${t('Card_Holder_Name')}:</strong> ${orderItem.orderPayment.cardHolderName}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto z-50" onClose={handleClose}>
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-5xl w-full">
              <button
                type="button"
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600"
                onClick={handleClose}
              >
                <span className="sr-only">{t('Product_Close')}</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="p-6 mt-8 flex">
                <div className="w-1/2 pr-4">
                  {orderItem && orderItem.imagePath ? (
                    <div>
                      <img
                        src={`${baseUrl}/uploads/1200_${orderItem.imagePath || '/uploads/imagenot.webp'}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div >
                      <img
                        src={`${baseUrl}/uploads/imagenot.webp`}
                        alt="Image Not Available"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                </div>

                <div className="w-1/2">
                  {orderItem ? (
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Order')}:</span>
                        <span className="text-gray-900">#{orderItem.orderId}-{orderItem.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Client')}:</span>
                        <span className="text-gray-900">{orderItem.order.firstName} {orderItem.order.lastName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Phone_Number')}:</span>
                        <span className="text-gray-900">{formatPhoneNumber(orderItem.order.phoneNumber)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Email')}:</span>
                        <span className="text-gray-900">{orderItem.order.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Product_Name')}:</span>
                        <span className="text-gray-900">{getLocalizedField(orderItem, 'name', lang)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Quantity')}:</span>
                        <span className="text-gray-900">{orderItem.quantity}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Quantity_in_stock')}:</span>
                        <span className="text-gray-900">{orderItem.product.storages?.map((storage, index) => {
                          const isSizeMatch = String(storage.size) === String(orderItem.size);
                          if (isSizeMatch) {
                            return <span key={index}>{storage.productQuantity}</span>;
                          }
                          return null;
                        })}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Size')}:</span>
                        <span className="text-gray-900">{orderItem.size}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Price')}:</span>
                        <span className="text-gray-900">{orderItem.price} €</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Date')}:</span>
                        <span className="text-gray-900">{new Date(orderItem.dueDate).toLocaleDateString()} {formatDateWithTime(orderItem.dueDate)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Orders_Status')}:</span>
                        <span className={`text-gray-900 ${colorClass}`}>{t(`${orderItem.status}`)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Payment')}:</span>
                        <span className={`font-medium ${orderItem.orderPayment.payment === 'The money has been paid' ? 'text-green-500' : 'text-red-500'}`}>{t(`${orderItem.orderPayment.payment}`)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Payment_Method')}:</span>
                        <span className="text-gray-900">{orderItem.orderPayment.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Card_Number')}:</span>
                        <span className="text-gray-900">{formatCardNumber(orderItem.orderPayment.cardNumber)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span className="font-medium text-gray-700">{t('Card_Holder_Name')}:</span>
                        <span className="text-gray-900">{orderItem.orderPayment.cardHolderName}</span>
                      </div>

                    </div>
                  ) : null}
                  <div className="flex justify-end p-4 border-gray-200">
                    <button
                      onClick={handlePrint}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-4 rounded mr-2"
                    >
                      {t('Print')}
                    </button>
                    <button
                      onClick={handleClose}
                      className="bg-gray-300 text-gray-700 hover:bg-gray-400 py-2 px-4 rounded"
                    >
                      {t('Close')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Invoice;
