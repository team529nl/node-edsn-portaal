export function utcDateTimeStringForSOAP(date: Date): string {
  return (
    date.getUTCFullYear() +
    '-' +
    ('0' + (date.getUTCMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getUTCDate()).slice(-2) +
    'T' +
    ('0' + date.getUTCHours()).slice(-2) +
    ':' +
    ('0' + date.getUTCMinutes()).slice(-2) +
    ':' +
    ('0' + date.getUTCSeconds()).slice(-2) +
    'Z'
  );
}

export function dateStringForSoap(date: Date): string {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getUTCMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getUTCDate()).slice(-2)
  );
}

export function dateStringForFilename(date: Date): string {
  return (
    date.getFullYear() +
    ('0' + (date.getUTCMonth() + 1)).slice(-2) +
    ('0' + date.getUTCDate()).slice(-2)
  );
}

export function dateStringForContractEnd(date: Date): string {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
}
