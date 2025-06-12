import { BonusesUserProps } from "../../../../interfaces/ProfileUser/ProfileUserProps";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/20/solid'
import { formatDate } from "../../../../services/custom/format-data";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedField } from "../../../../utils/localized/localized";

const Bonuses: React.FC<BonusesUserProps> = ({ userBonuses, bonusBalance }) => {
  const { t,  i18n } = useTranslation();
  const lang = i18n.language;
  const [showAllBonusess, setShowAllBonuses] = useState(false);
  const displayedBonuses = showAllBonusess ? userBonuses : userBonuses.slice(0, 6);
  const handleLoadAllProducts = () => {
    setShowAllBonuses((prevShowAllProducts) => !prevShowAllProducts);
  };
  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="px-4 py-6 sm:p-6 lg:pb-8 min-h-[500px]">
              <div className="sm:flex sm:items-center justify-between">
                <div >
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('Bonuses_MyBonuses')}</h1>
                  <div className='mt-5 text-green-700 bg-green-50 ring-green-600/20 rounded-md py-1 px-2 text-2xl font-medium  flex items-center justify-center leading-loose'>
                    {bonusBalance?.toLocaleString('uk-UA', { minimumFractionDigits: 3 }).slice(0, -1)} €
                  </div>
                </div>
                {userBonuses.length > 6 && (
                  <button onClick={handleLoadAllProducts} className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                    {showAllBonusess ? t('Bonuses_ShowLess') : t('Bonuses_BrowseAll')}
                    {showAllBonusess ? (<span aria-hidden="true"> &larr;</span>) : (<span aria-hidden="true"> &rarr;</span>)}
                  </button>
                )}
              </div>
              {userBonuses && userBonuses.length > 0 ? (
                <div className="-mx-4 mt-8 flow-root sm:mx-0">
                  <table className="min-w-full border-collapse">
                    <colgroup>
                      <col className="w-full sm:w-1/2" />
                      <col className="sm:w-1/6" />
                      <col className="sm:w-1/6" />
                      <col className="sm:w-1/6" />
                    </colgroup>
                    <thead className="border-b border-gray-300 text-gray-900">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          {t('Bonuses_Order')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                          {t('Bonuses_Operation')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                          {t('Bonuses_Description')}
                        </th>
                        <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                          {t('Bonuses_BonusesAccrued')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedBonuses.map((bonus) => (
                        <tr
                          key={bonus.id}
                          className={`border-b border-gray-200 ${bonus.bonusesOperation_en === "Accrual" ? "bg-green-50" : "bg-red-50"}`}
                        >
                          <td className="max-w-0 py-5 pl-6 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">{t('Bonuses_Order')} #{bonus.name}</div>
                            <div className="mt-1 truncate text-gray-500">{formatDate(bonus.orderDate, lang)}</div>
                          </td>
                          <td className="hidden text-right text-sm text-gray-500 sm:table-cell">{getLocalizedField(bonus, 'bonusesOperation', lang)}</td>
                          <td className="hidden text-right text-sm text-gray-500 sm:table-cell">{getLocalizedField(bonus, 'bonusesDescription', lang)}</td>
                          <td className="py-5 pl-3 pr-6 text-right text-sm text-gray-500 sm:pr-6 whitespace-nowrap">
                            {bonus.bonusesOperation_en === "Accrual" ? (
                              <ArrowUpCircleIcon className="mr-2 h-5 w-5 text-green-700 inline-block align-middle" />
                            ) : (
                              <ArrowDownCircleIcon className="mr-2 h-5 w-5 text-red-700 inline-block align-middle" />
                            )}{bonus.bonusesAccrued.toLocaleString('uk-UA', { minimumFractionDigits: 3 }).slice(0, -1)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th
                          scope="row"
                          colSpan={3}
                          className="hidden pl-6 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-6"
                        >
                          {t('Bonuses_BonusBalance')}
                        </th>
                        <th scope="row" className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                          {t('Bonuses_BonusBalance')}
                        </th>
                        <td className="pl-3 pr-6 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">{bonusBalance?.toLocaleString('uk-UA', { minimumFractionDigits: 3 }).slice(0, -1)} €</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="container mx-auto p-8 flex justify-center relative mx-auto max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row">
                  <div className="w-full lg:w-2/4 p-5 mb-8 lg:mb-0">
                    <div className="mt-8 flex justify-center mb-90">
                      <p>{t('Bonuses_NoBonuses')}</p>
                    </div>
                  </div>
                </div>
              )}
              {userBonuses.length > 6 && (
                <div className="mt-6 sm:hidden">
                  <button onClick={handleLoadAllProducts} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                    {showAllBonusess ? t('Bonuses_ShowLess') : t('Bonuses_BrowseAll')}
                    {showAllBonusess ? (<span aria-hidden="true"> &larr;</span>) : (<span aria-hidden="true"> &rarr;</span>)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Bonuses;
