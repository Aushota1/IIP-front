import React from 'react';

module.exports = {
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/' }),
};
