import { Routes, Route, Link, useLocation} from 'react-router-dom'
import ManageMenu from './pages/ManageMenu'
import ManageOrders from './pages/ManageOrders'
import OrdersBoard from './pages/OrdersBoard'
import History from './pages/History'
import { useState } from 'react'
import './App.css'
import { languages, t } from './i18n'

function App() {
  const location = useLocation();
  const isOrdersBoard = location.pathname === "/screen";
  const isIndex = location.pathname === "/";
  const [count, setCount] = useState(0)

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const setLanguage = (e) => {
    e.preventDefault();
    localStorage.setItem("language", selectedLanguage);
    window.location.reload();
  }

  return (
    <>
      {!isOrdersBoard && (
        <header>
          <h1>BurgerTask 🍔</h1>
          <nav>
            <Link to="/">{t.menu.home}</Link> |
            <Link to="/menu">{t.menu.manageMenu}</Link> |{" "}
            <Link to="/orders">{t.menu.orders}</Link> |{" "}
            <a href="/screen"  target="_blank"  rel="noopener noreferrer">{t.menu.ordersBoard}</a>{" "}|
            <Link to="/history">{t.menu.history}</Link>
          </nav>
        </header>
      )}

      {isIndex && (
        <div className="welcome-screen">
          <h2>{t.welcome}</h2>
          <p>{t.welcomeMessage}</p>
          <h3>{t.changeLanguageQuestion}</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select id='language' name='language'
            onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="">-- {t.selectLanguage} --</option>
              {languages.map((lang) => (
                <option value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button onClick={setLanguage}>{t.changeLanguage}</button>
          </div>
        </div>
      )}

      <div className={isOrdersBoard ? "fullscreen" : "navbar"}>
        <Routes>
          <Route path="/menu" element={<ManageMenu />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/screen" element={<OrdersBoard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </>
  )
}

export default App