import * as common from "./Common";

export interface SearchMeteringPointsRequestEnvelope {
  EDSNBusinessDocumentHeader: common.EDSNBusinessDocumentHeader;
  Portaal_Content: PortaalContent;
}

export interface PortaalContent {
  Portaal_MeteringPoint: PortaalMeteringPoint;
}

export interface PortaalMeteringPoint {
  EANID?: string;
  EDSN_AddressSearch?: common.EDSNAddressSearch;
  LocationDescription?: string;
  MarketSegment?: string;
  ProductType?: string;
}
