import { useTranslation } from "react-i18next";
import { ProfileUserProps } from "../../../../interfaces/ProfileUser/ProfileUserProps";
import { emailConfirm } from "../../../../services/accounts/account-services";
import { formatDate } from "../../../../services/custom/format-data";
import { formatPhoneNumber } from "../../../../services/custom/format-phone-number";

const Profile: React.FC<ProfileUserProps> = ({ userProfile, countPage }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const confirm = async () => {
    if (userProfile) {
      emailConfirm(userProfile?.email);
    }
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-md mb-8 mt-8">
        <div className="mx-auto max-w-2xl px-8 py-8 sm:px-6 sm:pt-8 lg:max-w-screen-2xl lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="px-4 pt-6 sm:p-6 lg:pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Profile_Profile')}</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_FirstName')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.firstName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_LastName')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.lastName}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_Birthday')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <time className="text-gray-900">{formatDate(userProfile?.birthday, lang)}</time>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_Orders')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{countPage}</div>
                  </dd>
                </div>

              </dl>
            </div>
            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Profile_ContactInfo')}</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_EmailAddress')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{userProfile?.email}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_Phone')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{formatPhoneNumber(userProfile?.phoneNumber)}</div>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Profile_SecurityInfo')}</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_AccountStatus')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">
                      {userProfile?.role}
                    </div>
                  </dd>
                </div>
                
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_EmailConfirmed')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userProfile?.emailConfirmed ? '#10b981' : '#ef4444' }}>
                      {userProfile?.emailConfirmed ? t('Profile_True') : t('Profile_False')}
                    </div>
                  </dd>
                </div>
                {!userProfile?.emailConfirmed &&
                  <div className="flex border-t border-gray-100 pt-6">
                    <button onClick={confirm} type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      {t('Profile_ConfirmYourEmail')}
                    </button>
                  </div>
                }
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_PhoneConfirmed')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div style={{ color: userProfile?.phoneNumberConfirmed ? '#10b981' : '#ef4444' }}>
                      {userProfile?.phoneNumberConfirmed ? t('Profile_True') : t('Profile_False')}
                    </div>
                  </dd>
                </div>
                {!userProfile?.phoneNumberConfirmed &&
                  <div className="flex border-t border-gray-100 pt-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      {t('Profile_ConfirmYourPhone')}
                    </button>
                  </div>
                }
              </dl>
            </div>

            <div className="px-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">{t('Profile_LanguageAndDates')}</h2>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_Language')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{t('Profile_English')}</div>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{t('Profile_DateFormat')}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">DD-MM-YYYY</div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile;