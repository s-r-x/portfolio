import React from 'react';
import routes from './routes';
import {Link} from 'react-router-dom';
import dict from '@/translations';

const MobileNav = ({lang}) => {
  return (
    <nav className="mobile-nav">
      <ul>
        {routes.map(({path, translationKey}) => (
          <li key={path}>
            <Link to={path}>{dict[translationKey][lang]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default MobileNav;
