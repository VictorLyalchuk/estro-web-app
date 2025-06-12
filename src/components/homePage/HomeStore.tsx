import { Fragment, useEffect, useState } from "react";
import { APP_ENV } from "../../env/config";
import { Link, useParams } from "react-router-dom";
import { ConfirmEmail } from "../../services/accounts/account-services";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useTranslation } from "react-i18next";
import { getMainCategory } from '../../services/category/category-services.ts';
import { IMainCategory } from "../../interfaces/Category/Main-Category/IMainCategory.ts";

const HomeStore = () => {
  const { t } = useTranslation();
  const baseUrl = APP_ENV.BASE_URL;
  const { email, token } = useParams<{ email: string, token: string }>();
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [open, setOpen] = useState(true)
  const [mainCategory, setMainCategory] = useState<IMainCategory[] | null>(null);

  useEffect(() => {
    getMainCategory()
      .then(data => {
        setMainCategory(data);
      })
      .catch(error => console.error('Error fetching main category data:', error));
    homePage(email, token);
  }, [email, token]);

  const homePage = async (email: string | null | undefined, token: string | null | undefined) => {
    if (email && token) {
      ConfirmEmail(email, token, (error) => {
        if (error) {
          console.error("Email verification error:", error);
        } else {
          setEmailConfirm(true);
        }
      });
    }
  }

  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto p-8 flex relative max-w-screen-2xl px-2 sm:px-2 lg:px-2 flex-col lg:flex-row justify-between">
          <div className="sm:mx-auto sm:w-full">
            <div className="w-full ">
              <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8">
                <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none ">
                  <div className="sm:min-h-[1800px] md:min-h-[1800px] lg:min-h-[1000px] min-h-[1300px] grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
                    <div className="relative flex group hover13 h-full">
                      {mainCategory && mainCategory.length > 0 && mainCategory[0]?.imagePath ? (
                        <img
                          src={`${baseUrl}/uploads/${mainCategory?.[0]?.imagePath}?v=${Date.now()}`}
                          alt=""
                          className=" absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ease-in-out saturate-[.77] group-hover:saturate-150"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 h-full w-full flex items-center justify-center">
                        </div>
                      )}
                      <div className="relative flex w-full flex-col items-end justify-start bg-black bg-opacity-10 p-8 sm:p-12">
                        <h1 className="mt-2 text-5xl font-medium text-white text-opacity-75">{t('HomeStore_Women')}</h1>
                        <Link to={"/catalog-home/women"} className="mt-4 text-xl px-1 py-1 font-semibold leading-7 text-white text-opacity-75 hover:text-indigo-400">
                          <span aria-hidden="true">&larr;</span> {t('HomeStore_ShopNow')}
                        </Link>
                      </div>
                    </div>
                    <div className="relative flex group hover13">
                      {mainCategory && mainCategory.length > 0 && mainCategory[0]?.imagePath ? (
                        <img
                          src={`${baseUrl}/uploads/${mainCategory?.[1]?.imagePath}?v=${Date.now()}`}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ease-in-out saturate-[.77] group-hover:saturate-150"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 h-full w-full flex items-center justify-center">
                        </div>
                      )}
                      <div className="relative flex w-full flex-col items-start justify-start bg-black bg-opacity-10 p-8 sm:p-12">
                        <h1 className="mt-2 text-5xl font-medium text-white text-opacity-75">{t('HomeStore_Men')}</h1>
                        <Link to={"/catalog-home/men"} className="mt-4 text-xl px-1 py-1 font-semibold leading-7 text-white text-opacity-75 hover:text-indigo-400">
                          {t('HomeStore_ShopNow')} <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {emailConfirm && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96">
                      <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => { setEmailConfirm(false) }}>
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                          </Transition.Child>

                          <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                              <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                  <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        {t('HomeStore_Success')}
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          {t('HomeStore_YourEmailVerified')}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-5 sm:mt-6">
                                    <button
                                      type="button"
                                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      onClick={() => setOpen(false)}
                                    >
                                      {t('HomeStore_GoBackToSite')}
                                    </button>
                                  </div>
                                </Dialog.Panel>
                              </Transition.Child>
                            </div>
                          </div>
                        </Dialog>
                      </Transition.Root>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HomeStore;
