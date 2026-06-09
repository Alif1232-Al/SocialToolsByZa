export default function HeroSection() {
  return (
    <section className="mb-16 flex flex-col items-center text-center pt-8">
      <div className="relative inline-block mb-6 max-w-full">
        <div className="bg-yellow-400 border-4 border-black p-4 sm:p-6 md:p-10 comic-shadow rotate-1 transform-gpu">
          <h1 className="font-display text-2xl sm:text-headline-lg-mobile md:text-display-xl text-black uppercase leading-none break-words">
            SOCIAL TOOLS BY ZA!!
          </h1>
        </div>
        <div className="absolute -bottom-5 left-1/4 w-10 h-10 bg-yellow-400 border-r-4 border-b-4 border-black rotate-45 z-[-1] comic-shadow"></div>
      </div>
      <p className="max-w-2xl font-body text-body-lg text-gray-600 dark:text-gray-300">
        Alat tempur kuliah, ngoding, dan ngonten terlengkap buat bertahan hidup sampai lulus!
      </p>
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <span className="bg-pink-500 text-white border-4 border-black px-4 py-1 font-body font-bold uppercase text-sm comic-shadow-sm -rotate-1">
          #Semester6Survival
        </span>
        <span className="bg-cyan-500 text-white border-4 border-black px-4 py-1 font-body font-bold uppercase text-sm comic-shadow-sm rotate-1">
          #NoDebtNoStress
        </span>
        <span className="bg-yellow-400 text-black border-4 border-black px-4 py-1 font-body font-bold uppercase text-sm comic-shadow-sm -rotate-2">
          #FullComicMode
        </span>
      </div>
    </section>
  );
}
