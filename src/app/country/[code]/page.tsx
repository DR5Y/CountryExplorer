// src/app/country/[code]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Country } from "../../../types/country";

// Fetch single country by code
async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
}

// Fetch border countries for the "Borders" section
async function getBorderCountries(borders: string[]): Promise<Country[]> {
  if (!borders || borders.length === 0) return [];
  
  try {
    const borderPromises = borders.map(border =>
      fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => data?.[0] || null)
    );
    
    const borderCountries = await Promise.all(borderPromises);
    return borderCountries.filter(Boolean);
  } catch (error) {
    console.error("Error fetching border countries:", error);
    return [];
  }
}

interface CountryDetailProps {
  params: {
    code: string;
  };
}

export default async function CountryDetail({ params }: CountryDetailProps) {
  const country = await getCountryByCode(params.code);
  
  if (!country) {
    notFound();
  }

  const borderCountries = await getBorderCountries(country.borders || []);

  // Helper function to safely get native name
  const getNativeName = (country: Country): string => {
    if (!country.name.nativeName) return country.name.official;
    
    const nativeNames = Object.values(country.name.nativeName);
    return nativeNames[0]?.official || country.name.official;
  };

  // Helper function to format currencies
  const formatCurrencies = (currencies: Country["currencies"]): string => {
    if (!currencies) return "No official currency";
    
    return Object.values(currencies)
      .map(currency => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`)
      .join(", ");
  };

  // Helper function to format languages
  const formatLanguages = (languages: Country["languages"]): string => {
    if (!languages) return "No official languages";
    
    return Object.values(languages).join(", ");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <span>←</span>
        <span>Back to Countries</span>
      </Link>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header with Flag */}
        <div className="relative h-64 w-full">
          <Image
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{country.name.common}</h1>
              <p className="text-xl opacity-90">{country.name.official}</p>
            </div>
          </div>
        </div>

        {/* Country Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Basic Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Native Name:</span>
                    <span>{getNativeName(country)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Region:</span>
                    <span>{country.region}</span>
                  </div>
                  {country.subregion && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Subregion:</span>
                      <span>{country.subregion}</span>
                    </div>
                  )}
                  {country.capital && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Capital:</span>
                      <span>{country.capital.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Demographics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Population:</span>
                    <span>{country.population.toLocaleString()}</span>
                  </div>
                  {country.area && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Area:</span>
                      <span>{country.area.toLocaleString()} km²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Cultural Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">Languages:</span>
                    <span className="text-sm">{formatLanguages(country.languages)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 block mb-1">Currencies:</span>
                    <span className="text-sm">{formatCurrencies(country.currencies)}</span>
                  </div>
                  {country.timezone && (
                    <div>
                      <span className="font-medium text-gray-600 block mb-1">Timezones:</span>
                      <span className="text-sm">{country.timezone.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coat of Arms */}
              {country.coatOfArms?.png && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Coat of Arms</h3>
                  <div className="w-32 h-32 relative">
                    <Image
                      src={country.coatOfArms.png}
                      alt={`Coat of arms of ${country.name.common}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Border Countries */}
          {borderCountries.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Border Countries</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {borderCountries.map((borderCountry) => (
                  <Link
                    key={borderCountry.cca3}
                    href={`/country/${borderCountry.cca3}`}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-6 relative flex-shrink-0">
                      <Image
                        src={borderCountry.flags.png}
                        alt={`Flag of ${borderCountry.name.common}`}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {borderCountry.name.common}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CountryDetailProps) {
  const country = await getCountryByCode(params.code);
  
  if (!country) {
    return {
      title: "Country Not Found",
    };
  }

  return {
    title: `${country.name.common} - Country Explorer`,
    description: `Learn about ${country.name.common}: population, capital, languages, and more.`,
  };
}