import { useEffect, useState } from 'react';
import App from './App.jsx';
import LegoNode from './lego1-node.jsx';
import LegoKotvy from './lego2-kotvy.jsx';
import LegoDvojice from './lego3-dvojice.jsx';
import LegoHrana from './lego4-hrana.jsx';
import LegoOzdoby from './lego5-ozdoby.jsx';
import LegoTypyHran from './lego6-typy-hran.jsx';
import './Menu.css';

const pages = [
  { id: 'app', title: 'App.jsx', subtitle: 'Kompletní ukázka', Component: App },
  { id: 'lego1-node', title: 'lego1-node.jsx', subtitle: 'Krok 1 · Uzel', Component: LegoNode },
  { id: 'lego2-kotvy', title: 'lego2-kotvy.jsx', subtitle: 'Krok 2 · Kotvy', Component: LegoKotvy },
  { id: 'lego3-dvojice', title: 'lego3-dvojice.jsx', subtitle: 'Krok 3 · Dvojice uzlů', Component: LegoDvojice },
  { id: 'lego4-hrana', title: 'lego4-hrana.jsx', subtitle: 'Krok 4 · Hrana', Component: LegoHrana },
  { id: 'lego5-ozdoby', title: 'lego5-ozdoby.jsx', subtitle: 'Krok 5 · Ozdoby hran', Component: LegoOzdoby },
  { id: 'lego6-typy-hran', title: 'lego6-typy-hran.jsx', subtitle: 'Krok 6 · Typy hran', Component: LegoTypyHran },
];

function getSelectedPage() {
  const id = window.location.hash.slice(1);
  return pages.find((page) => page.id === id) ?? null;
}

export default function Menu() {
  const [selectedPage, setSelectedPage] = useState(getSelectedPage);

  useEffect(() => {
    const updatePage = () => setSelectedPage(getSelectedPage());
    window.addEventListener('hashchange', updatePage);
    return () => window.removeEventListener('hashchange', updatePage);
  }, []);

  if (selectedPage) {
    const { Component } = selectedPage;
    return (
      <>
        <a className="menu-back" href="#menu" aria-label="Zpět do nabídky">
          <span aria-hidden="true">←</span> Nabídka
        </a>
        <Component />
      </>
    );
  }

  return (
    <main className="menu-page">
      <header className="menu-header">
        <p className="menu-eyebrow">React Flow · Interaktivní ukázky</p>
        <h1>Vyberte stránku</h1>
        <p className="menu-intro">Projděte si jednotlivé kroky nebo otevřete kompletní ukázku.</p>
      </header>
      <nav className="menu-grid" aria-label="Stránky projektu">
        {pages.map((page, index) => (
          <a className="menu-link" href={`#${page.id}`} key={page.id}>
            <span className="menu-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="menu-link-copy">
              <strong>{page.title}</strong>
              <span>{page.subtitle}</span>
            </span>
            <span className="menu-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </main>
  );
}
