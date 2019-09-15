/* This functions below are from the dropbox sdk examples to retreive the auth token from the query string */
export class Utils {

    private static parseQueryString(str: string): Object {
        var ret: {[k: string]: string[] | string} = Object.create(null);
      
        if (typeof str !== 'string') {
          return ret;
        }
      
        str = str.trim().replace(/^(\?|#|&)/, '');
      
        if (!str) {
          return ret;
        }
      
        str.split('&').forEach(function (param) {
          var parts = param.replace(/\+/g, ' ').split('=');
          // Firefox (pre 40) decodes `%3D` to `=`
          // https://github.com/sindresorhus/query-string/pull/37
          var key = parts.shift();
          var val = parts.length > 0 ? parts.join('=') : undefined;
      
          key = decodeURIComponent(key);
      
          // missing `=` should be `null`:
          // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
          val = val === undefined ? null : decodeURIComponent(val);
      
          var retVal = ret[key];
          if (ret[key] === undefined) {
            ret[key] = val;
          } else if (Array.isArray(retVal)) {
            retVal.push(val);
          } else {
            ret[key] = [<string> ret[key], val];
          }
        });
      
        return ret;
      }

// Parses the url and gets the access token if it is in the urls hash
public static getAccessTokenFromUrl(): string {
    return <string> Utils.parseQueryString(window.location.hash)['access_token'];
  }
}

  
  