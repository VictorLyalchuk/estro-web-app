import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BagItems, IBagUser } from "../../../../../interfaces/Bag/IBagUser";
import { decrease, deleteItems, increase } from "../../../../../services/bag/bag-services";
import { APP_ENV } from "../../../../../env/config";
import { useSelector } from "react-redux";
import { ICardReducerState } from "../../../../../store/bag/CardReducer";
import { t } from "i18next";
import { getLocalizedField } from "../../../../../utils/localized/localized";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../services/custom/format-data";

interface OrderSummaryProps {
  bagUser: IBagUser | undefined;
  bagItems: BagItems[];
  email: string | undefined;
  dispatch: React.Dispatch<any>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  bagUser,
  bagItems,
  email,
  dispatch,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = APP_ENV.BASE_URL;
  const { initialIndividualItemPrice } = useSelector((redux: any) => redux.card as ICardReducerState);

  return (
    <>
      {bagUser ? (
        <>
          <div className="w-full lg:w-2/4 p-5 lg:mb-0">
            <div className="bg-white p-5 rounded-md shadow-md mb-8">
              <div className="grid grid-rows-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 ">{t('Bag_OrderSummary')}</h1>
                <dl className="flex flex-wrap sm:flex-nowrap mt-2">
                  <dt className="text-gray-500">{t('Bag_OrderSummary_OrderDate')}&nbsp;</dt>
                  <dd className="font-medium text-gray-900"></dd>
                  <dt>
                    <span className="sr-only">{t('Bag_OrderSummary_Date')}</span>
                    <span className="mx-2 text-gray-400 hidden sm:inline" aria-hidden="true">
                      &middot;
                    </span>
                  </dt>
                  <dd className="font-medium text-gray-900 w-full sm:w-auto">
                    <time>{formatDate(bagUser.orderDate, lang)}</time>
                  </dd>
                </dl>
              </div>
            </div>
            {bagItems.map((item: BagItems, index: number) => (
              <div key={index} className="border-b bg-white pt-4 p-6 rounded-md shadow-md mb-8">
                <div className="flex justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">

                    <h3 className="font-semibold mb-4 mr-14 whitespace-nowrap">{t('Bag_OrderSummary_Product')} {index + 1}</h3>
                    <h3 className="font-semibold mb-4 whitespace-nowrap ">{getLocalizedField(item, 'name', lang)}</h3>
                  </div>
                  <button className="whitespace-nowrap w-auto h-10 mb-3 group rounded-full border border-gray-200 shadow-sm p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300"
                    onClick={() => deleteItems(item, email || '', dispatch)}>
                    <TrashIcon className="w-5 h-5 stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
                  </button>
                </div>
                <div className="border-t pt-4 flex">
                  {item.image && item.image.length > 0 ? (
                    <img
                      src={`${baseUrl}/uploads/1200_${item?.image || '/uploads/default.jpg'}`}
                      alt={item?.image}
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                  ) : (
                    <img
                      src={`${baseUrl}/uploads/imagenot.webp`}
                      alt="Image Not Available"
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                  )}
                  <div className="w-1/2 ml-4 mx-auto">
                    <h3 className="text-lg font-semibold mb-2 mr-auto">{t('Bag_OrderSummary_TotalProductPrice')} {initialIndividualItemPrice[item.id].toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</h3>
                    <p className="text-gray-600 mb-2">{t('Bag_OrderSummary_Size')}: {item.size}</p>
                    <p className="text-gray-600 mb-2">{t('Bag_OrderSummary_Article')}: {item.article}</p>
                    <p className="text-gray-600 mb-2">{t('Bag_OrderSummary_Price')}: {item.price.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} €</p>
                    <div className="flex items-center ml-auto mt-6">
                      <button
                        onClick={() => decrease(item, email || '', dispatch)}
                        className="mr-3 group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300">
                        <MinusIcon className="h-5 w-5 stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
                      </button>
                      <span
                        className="border border-gray-200 rounded-full w-10 aspect-square outline-none text-gray-900 font-semibold text-sm py-2 px-3 bg-gray-100  text-center"
                      > {item.quantity}</span>
                      <button
                        onClick={() => increase(item, email || '', dispatch)}
                        className="ml-3  group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-100 hover:border-gray-300 focus-within:outline-gray-300">
                        <PlusIcon className="h-5 w-5 stroke-gray-900 transition-all duration-500 group-hover:stroke-black" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (null
      )}
    </>
  );
};

export default OrderSummary;