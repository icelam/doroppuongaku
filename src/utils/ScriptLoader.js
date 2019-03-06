export default class ScriptLoader {
  constructor (options) {
    const { src, name, attr = {} } = options;
    this.src = src;
    this.name = name;
    this.attr = attr;
    this.isLoaded = false;
  }

  loadScript () {
    return new Promise((resolve, reject) => {
      // Create script element and set attributes
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = this.src;

      // Add Attributes
      for (const a in this.attr) {
        script.setAttribute(a, this.attr[a]);
      }

      // Append the script to the DOM
      const el = document.getElementsByTagName('body')[0];
      el.appendChild(script);

      // Resolve the promise once the script is loaded
      script.addEventListener('load', () => {
        this.isLoaded = true;
        resolve(script);
      });

      // Catch any errors while loading the script
      script.addEventListener('error', () => {
        reject(new Error(`${this.src} failed to load.`));
      });
    });
  }

  load () {
    return new Promise(async (resolve, reject) => {
      if (!this.isLoaded) {
        try {
          await this.loadScript();
          resolve(window[this.name]);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(window[this.name]);
      }
    });
  }
}