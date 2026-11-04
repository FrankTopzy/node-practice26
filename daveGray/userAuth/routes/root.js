const path = require('path');
const express = require('express');
const router = express.Router();


/**
 * @openapi
 * /:
 *   get:
 *     summary: Serve the home page
 *     responses:
 *       200:
 *         description: Returns index.html
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
/**
 * @openapi
 * /index.html:
 *   get:
 *     summary: Serve the home page (alternate URL)
 *     responses:
 *       200:
 *         description: Returns index.html
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get(['/', 'index{.html}'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});


/**
 * @openapi
 * /new-page.html:
 *   get:
 *     summary: Serve the new page
 *     responses:
 *       200:
 *         description: Returns new-page.html
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/new-page{.html}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});



/**
 * @openapi
 * /old-page.html:
 *   get:
 *     summary: Redirect to the new page
 *     responses:
 *       301:
 *         description: Permanent redirect to /new-page.html
 */
router.get('/old-page{.html}', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

module.exports = router;