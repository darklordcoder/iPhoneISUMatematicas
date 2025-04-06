import { useNavigate } from 'react-router-dom';

interface Language {
  name: string;
  logo: string;
  year: string;
}

export const ProgrammingLanguages = () => {
  const navigate = useNavigate();
  const languages: Language[] = [
    {
      name: "Python",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      year: "1991"
    },
    {
      name: "JavaScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      year: "1995"
    },
    {
      name: "Java",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      year: "1995"
    },
    {
      name: "C++",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      year: "1985"
    },
    {
      name: "C#",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      year: "2000"
    },
    {
      name: "TypeScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      year: "2012"
    },
    {
      name: "PHP",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      year: "1995"
    },
    {
      name: "Swift",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      year: "2014"
    },
    {
      name: "Go",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
      year: "2009"
    },
    {
      name: "R",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
      year: "1993"
    },
    {
      name: "Ruby",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
      year: "1995"
    },
    {
      name: "Kotlin",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
      year: "2011"
    },
    {
      name: "Rust",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
      year: "2010"
    },
    {
      name: "Dart",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
      year: "2011"
    },
    {
      name: "Scala",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
      year: "2004"
    },
    {
      name: "Haskell",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
      year: "1990"
    },
    {
      name: "Elixir",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
      year: "2011"
    }
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
          Programming Languages
        </h1>
      </div>

      {/* Lista de lenguajes */}
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
        {languages.map((lang, index) => (
          <div
            key={lang.name}
            className={`
              px-4 py-3
              bg-white
              flex items-center
              ${index !== languages.length - 1 ? 'border-b border-[#c6c6c8]' : ''}
              active:bg-gray-100
            `}
          >
            <div className="flex items-center flex-1">
              <img 
                src={lang.logo}
                alt={`${lang.name} logo`}
                className="w-8 h-8 object-contain mr-4"
              />
              <div>
                <span className="text-[#2c4c7c] font-medium">{lang.name}</span>
                <span className="text-[#8e8e93] text-sm ml-2">Created in {lang.year}</span>
              </div>
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