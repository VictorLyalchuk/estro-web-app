import { useEffect, useState } from 'react';
import { editOrderItems, getOrderQuantity, getOrdersByPage } from '../../../services/order/order-services';
import { Link as Scrollink } from 'react-scroll';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { getLocalizedField } from '../../../utils/localized/localized';
import { APP_ENV } from '../../../env/config';
import Invoice from './Invoice';
import { IOrderItemsAdmin } from '../../../interfaces/Order/IOrderItemsAdmin';
import { Modal } from 'antd';
import { ICreateOrderItemsAdmin } from '../../../interfaces/Order/ICreateOrderItemsAdmin';
import { formatDateWithTime } from '../../../services/custom/format-data';
import { OrderStatus } from '../../../interfaces/Type/OrderStatus';
import Loader from '../../../common/Loader/loader';
import { Link } from 'react-router-dom';
import { OrderReducerActionType } from '../../../store/order/OrderReducer';
import { useDispatch } from 'react-redux';

const statusOptions: OrderStatus[] = [
  'Order placed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
];

interface OrderItemsListProps {
  name: string;
  step: number[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ name, step }) => {
  const baseUrl = APP_ENV.BASE_URL;
  const [orderItems, setOrderItems] = useState<IOrderItemsAdmin[]>([]);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();
  const [modalVisibleStatusChange, setModalVisibleStatusChange] = useState<boolean>(false);
  const [modalVisiblePrintOrder, setModalVisiblePrintOrder] = useState<boolean>(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<IOrderItemsAdmin | null>(null);
  const [page, setPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const itemsPerPage = 10;
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(countPage / itemsPerPage);
  const visiblePages = 5;
  const [loading, setLoading] = useState(true);

  let startPage = Math.max(1, page - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const onPageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    setLoading(true)
    const loadOrders = async () => {
      try {
        const orders = await getOrdersByPage(page, itemsPerPage, step);
        setOrderItems(orders);
        const quantity = await getOrderQuantity(step);
        setCountPage(quantity);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    loadOrders().then(() => { setLoading(false); })
  }, [page, step]);

  const handleSelectChange = (orderItem: IOrderItemsAdmin, newStatus: OrderStatus) => {
    setSelectedOrderItem({
      ...orderItem,
      status: newStatus
    });
    setModalVisibleStatusChange(true);
  };

  const handleStatusChange = async (
    orderId: number,
    productId: number,
    size: number,
    newStatus: string
  ) => {
    const updatedOrders = orderItems.find(
      (item) => item.orderId === orderId && item.productId === productId && item.size === size
    );
    if (updatedOrders) {
      updatedOrders.status = newStatus;
      const model: ICreateOrderItemsAdmin = {
        id: updatedOrders.id,
        step: updatedOrders.step,
        status: updatedOrders.status,
        size: updatedOrders.size,
        quantity: updatedOrders.quantity,
        productId: updatedOrders.productId,
        orderId: updatedOrders.orderId,
      }
      try {
        setLoading(true);
        await editOrderItems(model);
        const orders = await getOrdersByPage(page, itemsPerPage, step);
        setOrderItems(orders);
        const quantity = await getOrderQuantity(step);
        setCountPage(quantity);

        if (step[0] === 0) {
          dispatch({
            type: OrderReducerActionType.ORDER_COUNT,
            payload: {
              countOrder: quantity,
            }
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    }
  };

  const handleConfirmChange = () => {
    if (selectedOrderItem) {
      handleStatusChange(
        selectedOrderItem.orderId,
        selectedOrderItem.productId,
        selectedOrderItem.size,
        selectedOrderItem.status
      );
      setModalVisibleStatusChange(false);
    }
  };

  const handleCancel = () => {
    setModalVisibleStatusChange(false);
  };

  const handleOpenModal = (orderItem: IOrderItemsAdmin) => {
    setSelectedOrderItem(orderItem);
    setModalVisiblePrintOrder(true);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Order placed':
        return 'bg-yellow-100 text-black'; // Жовтий
      case 'Processing':
        return 'bg-orange-200 text-black'; // Оранжевий
      case 'Shipped':
        return 'bg-blue-200 text-black'; // Синій
      case 'Delivered':
        return 'bg-green-300 text-black'; // Зелений
      case 'Cancelled':
        return 'bg-red-300 text-black'; // Червоний
      case 'Returned':
        return 'bg-gray-300 text-black'; // Червоний
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 product-start">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="px-4 text-base font-semibold leading-7 text-gray-900 sm:px-6 lg:px-8">{name}</h2>
        </div>
      </div>

      <div className="-mx-4 mt-10 ring-1 ring-gray-200 sm:mx-0 sm:rounded-lg">
        <table className="relative mt-6 w-full whitespace-nowrap text-left">
          <colgroup>
            <col className="xl:w-1/12" />
            <col className="xl:w-4/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
            <col className="xl:w-1/12" />
          </colgroup>
          <thead className="border-b border-white/10 text-sm leading-6 text-gray-900">
            <tr>
              <th scope="col" className="py-2 pl-8 pr-8 font-semibold sm:table-cell">
                {t('Orders_Order')}
              </th>
              <th scope="col" style={{ whiteSpace: 'pre-line' }} className="py-2 pl-8 pr-8 font-semibold hidden lg:table-cell">
                {t('Orders_Product_Name')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold md:table-cell sm:pr-6 lg:pr-8">
                {t('Orders_Size')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold xl:table-cell sm:pr-8 sm:text-left lg:pr-20">
                {t('Orders_Quantity')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden sm:table-cell sm:pr-8 sm:text-left lg:pr-20">
                {t('Orders_Quantity_in_stock')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-8 font-semibold hidden 2xl:table-cell lg:pr-20">
                {t('Orders_Price')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden xl:table-cell sm:pr-6 lg:pr-8">
                {t('Orders_Date')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold 2xl:table-cell sm:pr-6 lg:pr-8">
                {t('Orders_Status')}
              </th>
              <th scope="col" className="py-2 pl-8 pr-4 font-semibold hidden 2xl:table-cell sm:pr-6 lg:pr-8">
                {t('User_Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 min-h-[662px]">
                  <div className="min-h-[662px] flex items-center justify-center">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              orderItems.map((item) => (
                <tr key={`${item.orderId}-${item.productId}-${item.size}`} className="text-gray-700 hover:bg-gray-200 ">
                  <td className="py-4 pl-8 pr-4 sm:table-cell sm:pr-8 border-t border-b border-gray-200 hover:border-gray-100">
                    <div className="font-mono text-sm leading-6">{t('Orders_Order')} #{item.orderId}-{item.id}</div>
                  </td>
                  <td className="py-4 pl-8 pr-4 hidden lg:table-cell sm:pr-8 border-t border-b border-gray-200 whitespace-normal">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {item.imagePath && item.imagePath.length > 0 ? (
                        <img src={`${baseUrl}/uploads/1200_${item.imagePath || '/uploads/default.jpg'}`} className="h-20 rounded-md" />
                      ) : (
                        <img
                          src={`${baseUrl}/uploads/user404.webp`}
                          alt="Image Not Available"
                          className="h-20 rounded-md"
                        />
                      )}
                      <div className="hover:text-indigo-500 md:table-cell">
                        <Link to={`/product/${item.productId}`}>
                          <div className="font-medium text-sm leading-6" >{getLocalizedField(item, 'name', lang)}</div>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-8 pr-8 text-sm leading-6 md:table-cell lg:pr-20 border-t border-b border-gray-200">
                    {item.size}
                  </td>
                  <td className="py-4 pl-8 pr-4 text-sm leading-6 xl:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                    {item.quantity}
                  </td>
                  <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden sm:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                    {item.product.storages?.map((storage, index) => {
                      const isSizeMatch = storage.size === String(item.size);
                      if (isSizeMatch) {
                        return <span key={index}>{storage.productQuantity}</span>;
                      }
                      return null;
                    })}
                  </td>
                  <td className="py-4 pl-8 pr-4 text-sm leading-6 hidden 2xl:table-cell sm:pr-8 lg:pr-20 border-t border-b border-gray-200">
                    {item.price} €
                    {item.order.discount > 0 && (
                      <span className="block text-red-500 mt-1">- {item.order.discount} €</span>
                    )}
                  </td>
                  <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden xl:table-cell lg:pr-20 border-t border-b border-gray-200">
                    <div>
                      {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      {formatDateWithTime(item.dueDate)}
                    </div>
                  </td>
                  <td className="py-4 pl-8 pr-8 text-sm leading-6 sm:table-cell lg:pr-20 border-t border-b border-gray-200">
                    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                      <select
                        className={`p-2 border rounded ${getStatusClass(item.status)}`}
                        value={item.status}
                        onChange={(e) => { handleSelectChange(item, e.target.value as OrderStatus); }}
                      >
                        {statusOptions.filter((status) => {
                          const isSizeInStock = item.product.storages?.some(
                            (storage) => storage.size === String(item.size) && storage.productQuantity >= item.quantity && storage.inStock === true
                          );

                          if (item.status === 'Cancelled' || item.status === 'Returned') {
                            return status === item.status;
                          }

                          // Прибираємо статус "Returned" зі списку, якщо поточний статус не "Delivered"
                          if (status === 'Returned' && item.status !== 'Delivered') {
                            return false;
                          }

                          // Прибираємо статус "Order placed", якщо поточний статус "Processing", "Shipped", або "Delivered"
                          if (status === 'Order placed' && (item.status === 'Processing' || item.status === 'Shipped' || item.status === 'Delivered')) {
                            return false;
                          }

                          // Прибираємо статус "Processing", якщо поточний статус "Shipped" або "Delivered"
                          if (status === 'Processing' && (item.status === 'Shipped' || item.status === 'Delivered')) {
                            return false;
                          }

                          // Прибираємо статус "Shipped", якщо поточний статус "Delivered"
                          if (status === 'Shipped' && item.status === 'Delivered') {
                            return false;
                          }

                          // Remove "Shipped" or "Delivered" if the current status is "Order placed"
                          if (['Shipped', 'Delivered'].includes(status) && item.status === 'Order placed') {
                            return false;
                          }

                          // Прибираємо статус "Cancelled", якщо поточний статус "Delivered" або "Returned"
                          if (status === 'Cancelled' && (item.status === 'Delivered' || item.status === 'Returned')) {
                            return false;
                          }

                          // Прибираємо статус "Delivered", якщо поточний статус "Processing"
                          if (status === 'Delivered' && item.status === 'Processing') {
                            return false;
                          }

                          // Якщо товару немає на складі, якщо поточний статус "Delivered"
                          if (!isSizeInStock && item.status === 'Delivered') {
                            // Прибираємо статуси, які вимагають наявності товару
                            if (['Processing', 'Shipped'].includes(status)) {
                              return false;
                            }
                          }
                          else if (!isSizeInStock && item.status === 'Shipped') {
                            // Прибираємо статуси, які вимагають наявності товару
                            if (['Processing'].includes(status)) {
                              return false;
                            }
                          }
                          else if (!isSizeInStock && item.status === 'Processing') {
                            // Не прибираємо інші статуси, дозволяючи вибрати 'Shipped', 'Delivered' і 'Returned'
                          }
                          else if (!isSizeInStock) {
                            // Прибираємо статуси, які вимагають наявності товару
                            if (['Processing', 'Shipped', 'Delivered'].includes(status)) {
                              return false;
                            }
                          }
                          return true;
                        })
                          .map((status) => {
                            let color;
                            switch (status) {
                              case 'Order placed':
                                color = 'bg-yellow-100';
                                break;
                              case 'Processing':
                                color = 'bg-orange-200';
                                break;
                              case 'Shipped':
                                color = 'bg-blue-200';
                                break;
                              case 'Delivered':
                                color = 'bg-green-300';
                                break;
                              case 'Cancelled':
                                color = 'bg-red-300';
                                break;
                              case 'Returned':
                                color = 'bg-gray-200';
                                break;
                              default:
                                color = 'bg-black-200';
                            }
                            return (
                              <option key={status} value={status} className={color}>
                                {t(`${status}`)}
                                {/* {status} */}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 pl-8 pr-8 text-sm leading-6 hidden 2xl:table-cell lg:pr-20 border-t border-b border-gray-200">
                    <button className="block mx-auto w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => handleOpenModal(item)}>
                      {t('Orders_Invoice')}
                    </button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>

        <Invoice
          isOpen={modalVisiblePrintOrder}
          setOpen={setModalVisiblePrintOrder}
          orderItem={selectedOrderItem}
        />

        {/* Pagination */}
        <nav className="flex items-center justify-between bg-white rounded-md shadow-md bg-white px-4 py-3 sm:px-6">
          <div className="container mx-auto p-4 flex relative max-w-7xl lg:flex-row justify-between ">
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
                  <Scrollink to="product-start" smooth={true}>
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
                    <Scrollink to="product-start" smooth={true}>
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
                      <Scrollink to="product-start" smooth={true} key={pageNumber}>
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
                    <Scrollink to="product-start" smooth={true}>
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

                  <Scrollink to="product-start" smooth={true}>
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
      </div>

      <Modal
        title={t('Orders_Change_Status')}
        open={modalVisibleStatusChange}
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        <p>{t('Orders_Model')}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            key="delete"
            type="button"
            onClick={handleConfirmChange}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t('Orders_Change')}
          </button>
          <button
            key="cancel"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {t('Orders_Cancel')}
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default OrderItemsList;
