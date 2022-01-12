export function createStorageMapSpy() {
   return jasmine.createSpyObj('StorageMap', ['get', 'set', 'delete']);
}
