# Une index.html + styles.css + game.js en un solo archivo (necesario para publicarlo como página)
import pathlib
d = pathlib.Path(__file__).parent
h = (d / 'index.html').read_text(encoding='utf-8')
h = h.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + (d / 'styles.css').read_text(encoding='utf-8') + '</style>')
h = h.replace('<script src="game.js"></script>', '<script>\n' + (d / 'game.js').read_text(encoding='utf-8') + '\n</script>')
out = d.parent / 'mi-vida-v7.html'
out.write_text(h, encoding='utf-8')
print(out, len(h))
