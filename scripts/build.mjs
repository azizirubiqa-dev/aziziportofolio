import { build } from 'esbuild';
await build({ entryPoints: ['src/app.jsx'], bundle: true, minify: true, sourcemap: true, outfile: 'Asset/dist/app.js', loader: { '.jsx': 'jsx' }, jsx: 'automatic', target: ['es2020','chrome100','safari15','firefox100'], define: { 'process.env.NODE_ENV': '"production"' } });
await build({ entryPoints: ['src/admin.jsx'], bundle: true, minify: true, sourcemap: true, outfile: 'Asset/dist/admin.js', loader: { '.jsx': 'jsx' }, jsx: 'automatic', target: ['es2020','chrome100','safari15','firefox100'], define: { 'process.env.NODE_ENV': '"production"' } });
console.log('Portfolio built: index.html + Asset/dist/app.js + Asset/dist/app.css');
console.log('Admin built: admin.html + Asset/dist/admin.js + Asset/dist/admin.css');
