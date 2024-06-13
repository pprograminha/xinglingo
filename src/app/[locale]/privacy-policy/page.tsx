import { Logo } from '@/components/logo'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'

export default async function PrivacyPage() {
  const t = await getTranslations()
  return (
    <>
      <div className="px-4 container  md:px-8 py-6">
        <Logo className="mb-4" />
        <h2 className={`${pixelatedFont()} text-4xl font-bold`}>
          {t('Privacy Policy')}
        </h2>
        <p>
          <span>
            {t(
              "Your privacy is important to us It is Xinglingo's policy to respect your privacy regarding any information we may collect on the site",
            )}
            <Link href="https://lingos.life">{t('Xinglingo')}</Link>
            {t(', and other sites we own and operate')}
          </span>
        </p>
        <p>
          <span>
            {t(
              'We only ask for personal information when we truly need it to provide a service to you We do so by fair and lawful means, with your knowledge and consent We also inform you why we are collecting it and how it will be used',
            )}
          </span>
        </p>
        <p>
          <span>
            {t(
              'We only retain collected information for as long as necessary to provide you with your requested service What data we store, we will protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification',
            )}
          </span>
        </p>
        <p>
          <span>
            {t(
              'We don’t share any personally identifying information publicly or with third-parties, except when required to by law',
            )}
          </span>
        </p>
        <p>
          <span>
            {t(
              'Our website may link to external sites that are not operated by us Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective',
            )}
          </span>
          <Link
            href="https://politicaprivacidade.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('privacy policies')}
          </Link>
          <span>.</span>
        </p>
        <p>
          <span>
            {t(
              'You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services',
            )}
          </span>
        </p>
        <p>
          <span>
            {t(
              'Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information If you have any questions about how we handle user data and personal information, feel free to contact us',
            )}
          </span>
        </p>
        <p>
          <span />
        </p>
        <h1 className={`${pixelatedFont()} text-3xl mt-2 font-bold`}>
          {t('Cookies')}
        </h1>
        <ul>
          <li>
            <span>
              {t(
                'Behavioral advertising cookies used by this site are designed to ensure that you provide the most relevant advertisements possible, anonymously tracking your interests and presenting similar things that may be of interest to you',
              )}
            </span>
          </li>
          <li>
            <span>
              {t(
                "Several partners advertise on our behalf and affiliate tracking cookies simply allow us to see if our customers have accessed the site through one of our partners' sites, so that we can credit them appropriately and, where applicable, allow our affiliate partners to offer any promotion that may provide you to make a purchase",
              )}
            </span>
          </li>
        </ul>
        <h3 className={`${pixelatedFont()} text-2xl mt-8 font-bold`}>
          {t('User Commitment')}
        </h3>
        <p>
          <span>
            {t(
              'The user undertakes to make appropriate use of the contents and information that Xinglingo offers on the site and with an enunciative but not limitative character:',
            )}
          </span>
        </p>
        <ul>
          <li>
            <span>
              {t(
                'A) Not to engage in activities that are illegal or contrary to good faith and public order;',
              )}
            </span>
          </li>
          <li>
            <span>
              {t(
                'B) Not to spread propaganda or content of a racist, xenophobic nature, ',
              )}
              <Link
                href="https://betnacionalbrasil.br.com"
                style={{
                  color: 'inherit !important',
                  textDecoration: 'none !important',
                  fontSize: 'inherit !important',
                }}
              >
                {t('Bet Nacional')}
              </Link>
              ,{' '}
              {t(
                'any type of illegal pornography, terrorism advocacy or against human rights;',
              )}
            </span>
          </li>
          <li>
            <span>
              {t(
                'C) Not to cause damage to the physical (hardware) and logical (software) systems of Xinglingo, its suppliers or third parties, to introduce or spread computer viruses or any other hardware or software systems that are capable of causing the damage mentioned above',
              )}
            </span>
          </li>
        </ul>
        <h3>
          <span>{t('More information')}</span>
        </h3>
        <p>
          <span>
            {t(
              'We hope this is clarified, and as previously mentioned, if there is something that you are not sure whether you need or not, it is generally safer to leave cookies enabled, if it interacts with one of the features you use on our site',
            )}
          </span>
        </p>
        <p>
          <span>{t('This policy is effective as of June 5, 2024 19:21')}</span>
        </p>
      </div>
    </>
  )
}
