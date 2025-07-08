import { Address, AddressApiResult } from 'src/app/features/authentication/models/user.model';

export function getFormattedAddress(matchedApiAddress: AddressApiResult): Address {
  return {
    houseNumber: matchedApiAddress?.address?.house_number || '',
    streetName: matchedApiAddress?.address?.road || '',
    zipCode: matchedApiAddress?.address?.postcode || '',
    city: matchedApiAddress?.address?.city || '',
    country: matchedApiAddress?.address?.country || '',
    displayName: matchedApiAddress?.display_name || '',
  };
}
