import { useEffect } from 'react';
import { useAppSelector } from 'store';
import { selectCompanyLicense, selectSystemLicense } from 'store/features';

export const useDynamicManifest = () => {
  const { item: system } = useAppSelector(selectSystemLicense);
  const { item: company } = useAppSelector(selectCompanyLicense);
  const systemLicenseShortName = system?.terms?.licensee.shortName || '';
  const companyLicenseShortName = company?.terms?.licensee.shortName || '';

  useEffect(() => {
    if (!systemLicenseShortName || !companyLicenseShortName) {
      return;
    }

    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;

    if (!manifestLink) {
      return;
    }

    fetch(manifestLink.href)
      .then((res) => res.json())
      .then((manifest) => {
        const baseUrl = window.location.origin;

        manifest.name = `Fossa - ${companyLicenseShortName} (${systemLicenseShortName})`;
        manifest.short_name = `Fossa - ${companyLicenseShortName}`;
        manifest.start_url = `${baseUrl}/`;

        manifest.icons = manifest.icons.map((icon: any) => {
          if (/^https?:\/\//.test(icon.src)) {
            return icon;
          }

          return { ...icon, src: `${baseUrl}/${icon.src.replace(/^\/?/, '')}` };
        });

        const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const newManifestURL = URL.createObjectURL(blob);

        manifestLink.href = newManifestURL;
      })
      .catch(console.error);
  }, [companyLicenseShortName, systemLicenseShortName]);
};
