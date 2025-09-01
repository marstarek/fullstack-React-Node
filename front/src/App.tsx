// import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import Testlanguges from "../src/components/Testlanguges/Testlanguges";





// export default function App() {
//   const { t, i18n } = useTranslation();

//   useEffect(() => {
//     const dir = i18n.language === "ar" ? "rtl" : "ltr";
//     document.documentElement.setAttribute("dir", dir);
//     document.documentElement.setAttribute("lang", i18n.language);
//   }, [i18n.language]);

//   return (
//     <div className="p-6 text-left rtl:text-right">
//       <Testlanguges />
//       <h1 className="text-3xl font-bold mb-4">{t("welcome")}</h1>
//       <h2 className="text-xl font-semibold bg-gray-200 p-2">{t("nametitle")}</h2>
//       <p className="mt-4 bg-gray-300 p-4 ">{t("para")}</p>
//     </div>
//   );
// }


import { useDispatch, useSelector } from 'react-redux';
import AppRoute from './router/AppRoute'
import type { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { fetchUser } from './store/authSlice';

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // 🔹 if token exists in localStorage or Redux -> fetch user
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);
  return (
    <div>
     
      <AppRoute />
    </div>
  )
}
