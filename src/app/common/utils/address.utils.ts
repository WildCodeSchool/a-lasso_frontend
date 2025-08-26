import { Address, AddressApiResult } from 'src/app/features/authentication/models/user.model';

export function getFormattedAddress(matchedApiAddress: AddressApiResult): Address {
  return {
    houseNumber: matchedApiAddress?.address?.houseNumber || '',
    streetName: matchedApiAddress?.address?.road || '',
    zipCode: matchedApiAddress?.address?.postCode || '',
    city: matchedApiAddress?.address?.city || '',
    country: matchedApiAddress?.address?.country || '',
    displayName: matchedApiAddress?.displayName || '',
  };
}
