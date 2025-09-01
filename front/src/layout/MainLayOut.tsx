import Footer from "@/shared/Footer/Footer";
import Header from "@/shared/Header/Header";

function MainLayOut( {children}: {children: React.ReactNode} ) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayOut;
