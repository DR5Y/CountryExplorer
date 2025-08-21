import Image from "next/image";
import Link from "next/link";
import { Country } from "@/types/country";

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

function filterCountries(
  countries: Country[],
  search: string = "",
  region: string = ""
): Country[] {
  return countries.filter(country => {
    const matchesSearch = search === "" ||
    country.name.common.toLowerCase().includes(search.toLowerCase()) || country.name.official.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = region === "" || country.region === region;

    return matchesRegion && matchesRegion;
  });
}

interface HomeProps {
  searchParams: {
    search?: string;
    region?: string;
  };
}

export default async function Home({searchParams}: HomeProps) {
  const countries = await getCountries();
  const {search = "", region = ""} = searchParams;

  //filter countries
  const filteredCountries = filterCountries(countries, search, region);

  //sorting countries alphabetically
  const sortedCountries = filteredCountries.sort((a,b) => 
  a.name.common.localeCompare(b.name.common)
);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text gray-800">Countries of the world</h1>
      </div>

      {/* Countries Grid */}
      {sortedCountries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg"></p>
        </div>
      ): (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedCountries.map((country: Country) => (
            <Link key={country.cca3}
            href={`/country/${country.cca3}`}
            className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group-hover:scale-105 transform transition-transform">
                <div className="relative h-32 w-full">
                  <Image
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                    {country.name.common}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{country.region}</p>
                  <p className="text-sm text-gray-500">Population: {country.population.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
