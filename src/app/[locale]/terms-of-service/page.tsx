import { Logo } from '@/components/logo'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'

export default async function PrivacyPage() {
  const t = await getTranslations()
  return (
    <div className="px-4 container md:px-8 py-6">
      <Logo className="mb-4" />

      <h1 className={`${pixelatedFont.className} text-4xl mt-8 font-bold`}>
        1. {t('Terms')}
      </h1>

      <p>
        <span>
          {t('By accessing the website')}{' '}
          <a href="https://xinglingo.com">{t('Xinglingo')}</a>,{' '}
          {t(
            'you agree to comply with these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with all local laws If you do not agree with any of these terms, you are prohibited from using or accessing this site The materials contained in this site are protected by applicable copyright and trademark law',
          )}
        </span>
      </p>

      <h2>
        <span>2. {t('Use License')}</span>
      </h2>

      <p>
        <span>
          {t(
            'Permission is granted to temporarily download one copy of the materials (information or software) on the Xinglingo website for personal, non-commercial transitory viewing only This is the grant ofa license, not a transfer of title, and under this license, you may not',
          )}
        </span>
      </p>

      <ol>
        <li>
          <span>{t('modify or copy the materials;')}</span>
        </li>
        <li>
          <span>
            {t(
              'use the materials for any commercial purpose or for any public display (commercial or non-commercial);',
            )}
          </span>
        </li>
        <li>
          <span>
            {t(
              'attempt to decompile or reverse engineer any software contained on the Xinglingo website;',
            )}
          </span>
        </li>
        <li>
          <span>
            {t(
              'remove any copyright or other proprietary notations from the materials;',
            )}
          </span>
        </li>
        <li>
          <span>
            {t(
              'transfer the materials to another person or "mirror" the materials on any other server',
            )}
          </span>
        </li>
      </ol>

      <p>
        <span>
          {t(
            'This license shall automatically terminate if you violate any of these restrictions and may be terminated by Xinglingo at any time Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format',
          )}
        </span>
      </p>

      <h2>
        <span>3. {t('Disclaimer')}</span>
      </h2>

      <ol>
        <li>
          <span>
            {t(
              'The materials on Xinglingo\'s website are provided "as is" Xinglingo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights',
            )}
          </span>
        </li>
        <li>
          <span>
            {t(
              'Further, Xinglingo does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site',
            )}
          </span>
        </li>
      </ol>

      <h2>
        <span>4. {t('Limitations')}</span>
      </h2>

      <p>
        <span>
          {t(
            "In no event shall Xinglingo or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Xinglingo's website, even if Xinglingo or a Xinglingo authorized representative has been notified orally or in writing of the possibility of such damage Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you",
          )}
        </span>
      </p>

      <h2>
        <span>5. {t('Accuracy of materials')}</span>
      </h2>

      <p>
        <span>
          {t(
            "The materials appearing on Xinglingo's website could include technical, typographical, or photographic errors Xinglingo does not warrant that any of the materials on its website are accurate, complete, or current Xinglingo may make changes to the materials contained on its website at any time without notice However, Xinglingo does not make any commitment to update the materials",
          )}
        </span>
      </p>

      <h2>
        <span>6. {t('Links')}</span>
      </h2>

      <p>
        <span>
          {t(
            "Xinglingo has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site The inclusion of any link does not imply endorsement by Xinglingo of the site Use of any such linked website is at the user's own risk",
          )}
        </span>
      </p>

      <p>
        <br />
      </p>

      <h3 className={`${pixelatedFont.className} text-2xl mt-8 font-bold`}>
        {t('Modifications')}
      </h3>

      <p>
        <span>
          {t(
            'Xinglingo may revise these terms of service for its website at any time without notice By using this website, you agree to be bound by the then current version of these terms of service',
          )}
        </span>
      </p>

      <h3>
        <span>{t('Governing Law')}</span>
      </h3>

      <p>
        <span>
          {t(
            'These terms and conditions are governed by and construed in accordance with the laws of Xinglingo and you irrevocably submit to the exclusive jurisdiction of the courts in that state or locality',
          )}
        </span>
      </p>
    </div>
  )
}
