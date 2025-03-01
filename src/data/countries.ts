interface Country {
  code: string;
  name: string;
  regions?: string[];
}

const countries: Country[] = [
  {
    code: 'GB',
    name: 'United Kingdom',
    regions: [
      'England',
      'Scotland',
      'Wales',
      'Northern Ireland',
    ],
  },
  {
    code: 'IE',
    name: 'Ireland',
  },
  {
    code: 'FR',
    name: 'France',
  },
  {
    code: 'DE',
    name: 'Germany',
  },
  {
    code: 'IT',
    name: 'Italy',
  },
  {
    code: 'ES',
    name: 'Spain',
  },
  {
    code: 'PT',
    name: 'Portugal',
  },
  {
    code: 'NL',
    name: 'Netherlands',
  },
  {
    code: 'BE',
    name: 'Belgium',
  },
  {
    code: 'LU',
    name: 'Luxembourg',
  },
  {
    code: 'DK',
    name: 'Denmark',
  },
  {
    code: 'SE',
    name: 'Sweden',
  },
  {
    code: 'NO',
    name: 'Norway',
  },
  {
    code: 'FI',
    name: 'Finland',
  },
  {
    code: 'AT',
    name: 'Austria',
  },
  {
    code: 'CH',
    name: 'Switzerland',
  },
  {
    code: 'GR',
    name: 'Greece',
  },
  {
    code: 'PL',
    name: 'Poland',
  },
  {
    code: 'CZ',
    name: 'Czech Republic',
  },
  {
    code: 'SK',
    name: 'Slovakia',
  },
  {
    code: 'HU',
    name: 'Hungary',
  },
  {
    code: 'RO',
    name: 'Romania',
  },
  {
    code: 'BG',
    name: 'Bulgaria',
  },
  {
    code: 'HR',
    name: 'Croatia',
  },
  {
    code: 'SI',
    name: 'Slovenia',
  },
  {
    code: 'EE',
    name: 'Estonia',
  },
  {
    code: 'LV',
    name: 'Latvia',
  },
  {
    code: 'LT',
    name: 'Lithuania',
  },
  {
    code: 'CY',
    name: 'Cyprus',
  },
  {
    code: 'MT',
    name: 'Malta',
  },
  {
    code: 'US',
    name: 'United States',
  },
  {
    code: 'CA',
    name: 'Canada',
  },
  {
    code: 'AU',
    name: 'Australia',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
  },
];

// Sort countries by name
countries.sort((a, b) => a.name.localeCompare(b.name));

export default countries;

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryName = (code: string): string => {
  const country = getCountryByCode(code);
  return country ? country.name : code;
};

export const getCountryCodes = (): string[] => {
  return countries.map(country => country.code);
};

export const getCountryNames = (): string[] => {
  return countries.map(country => country.name);
};
