import { useNavigate } from 'react-router-dom';

interface City {
  name: string;
  country: string;
  code: string;
}

export const CitiesList = () => {
  const navigate = useNavigate();
  const cities: City[] = [
    { name: "Tokyo", country: "Japan", code: "jp" },
    { name: "New York City", country: "USA", code: "us" },
    { name: "London", country: "UK", code: "gb" },
    { name: "Paris", country: "France", code: "fr" },
    { name: "Singapore", country: "Singapore", code: "sg" },
    { name: "Dubai", country: "UAE", code: "ae" },
    { name: "Rome", country: "Italy", code: "it" },
    { name: "Barcelona", country: "Spain", code: "es" },
    { name: "Sydney", country: "Australia", code: "au" },
    { name: "Hong Kong", country: "China", code: "hk" },
    { name: "Berlin", country: "Germany", code: "de" },
    { name: "Toronto", country: "Canada", code: "ca" },
    { name: "Amsterdam", country: "Netherlands", code: "nl" },
    { name: "Seoul", country: "South Korea", code: "kr" },
    { name: "Mumbai", country: "India", code: "in" },
    { name: "Rio de Janeiro", country: "Brazil", code: "br" },
    { name: "Cape Town", country: "South Africa", code: "za" },
    { name: "Moscow", country: "Russia", code: "ru" },
    { name: "Stockholm", country: "Sweden", code: "se" },
    { name: "Vienna", country: "Austria", code: "at" },
    { name: "Bangkok", country: "Thailand", code: "th" },
    { name: "Dublin", country: "Ireland", code: "ie" },
    { name: "Prague", country: "Czech Republic", code: "cz" },
    { name: "Istanbul", country: "Turkey", code: "tr" },
    { name: "Venice", country: "Italy", code: "it" },
    { name: "Buenos Aires", country: "Argentina", code: "ar" },
    { name: "Copenhagen", country: "Denmark", code: "dk" },
    { name: "Madrid", country: "Spain", code: "es" },
    { name: "Mexico City", country: "Mexico", code: "mx" },
    { name: "Athens", country: "Greece", code: "gr" }
  ];

  return (
    <div className="h-full bg-[#f2f2f7]">
      {/* Header */}
      <div className="bg-[#f8f8f8] border-b border-[#c6c6c8] px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-[#3478c9]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-[#2c4c7c] flex-1 text-center">
          World Cities
        </h1>
      </div>

      {/* Lista de ciudades */}
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
        {cities.map((city, index) => (
          <div
            key={`${city.name}-${city.country}`}
            className={`
              px-4 py-3
              bg-white
              flex items-center
              ${index !== cities.length - 1 ? 'border-b border-[#c6c6c8]' : ''}
              active:bg-gray-100
            `}
          >
            <div className="flex items-center flex-1">
              <img 
                src={`https://flagcdn.com/w40/${city.code}.png`}
                alt={`${city.country} flag`}
                className="w-6 h-4 object-cover rounded mr-3"
              />
              <span className="text-[#2c4c7c]">{city.name}, {city.country}</span>
            </div>
            <svg
              className="w-4 h-4 text-[#c7c7cc]"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}; 