module.exports = {
  print,
  memorySizeOf,
  formatByteSize
};

function memorySizeOf(obj) {
  let bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number': bytes += 8;
        break;

        case 'string': bytes += obj.length * 2;
        break;

        case 'boolean': bytes += 4;
        break;

        case 'object':
          let objClass = Object.prototype.toString.call(obj).slice(8, -1);

          if (objClass === 'Object' || objClass === 'Array') {
            for (let key in obj) {
              if (!obj.hasOwnProperty(key)) continue;

              sizeOf(obj[key]);
            }
          } else {
            bytes += obj.toString().length * 2;
          }

        break;
      }
    }

    return bytes;
  };

  return sizeOf(obj);
};

function formatByteSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
  else return (bytes / 1073741824).toFixed(3) + " GiB";
};

function print(...args) {
  console.log(...args);
}

print.header = (headeline) => {
  console.log('\n\n\n\n\n\n\n\n\n');
  console.log('==========================================');
  console.log(`               ${headeline}               `);
  console.log('==========================================');
  console.log('\n\n\n\n\n\n\n\n\n');
};
