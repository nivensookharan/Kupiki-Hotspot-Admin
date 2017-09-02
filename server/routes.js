/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  // app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/cpu', require('./api/cpu'));
  app.use('/api/disk', require('./api/disk'));
  app.use('/api/information', require('./api/information'));
  app.use('/api/memory', require('./api/memory'));
  app.use('/api/services', require('./api/services'));
  app.use('/api/uptime', require('./api/uptime'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
