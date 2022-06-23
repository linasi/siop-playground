import './index.scss';

// PROVIDER:
// DID PRIVATE KEY: 302e020100300506032b6570042204204011514beda56f470a31874ccb139060118147bea04b16422658ffd6fcb2d59d
// DID PUBLIC KEY: 302a300506032b65700321005b197c50630180b0f5af7c841f7e9364e24edf96be5d47d4844d09bf075a6b32
// did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488

const PROVIDER_DID = {
  '@context': 'https://www.w3.org/ns/did/v1',
  id: 'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488',
  verificationMethod: [
    {
      id: 'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488#did-root-key',
      type: 'Ed25519VerificationKey2018',
      controller:
        'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488',
      publicKeyMultibase: 'z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3',
    },
  ],
  assertionMethod: [
    'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488#did-root-key',
  ],
  authentication: [
    'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488#did-root-key',
  ],
};

const input = document.getElementById('siop-request') as HTMLInputElement;
const submitButton = document.getElementById('submit-response');
const provider = new DID_SIOP.Provider();

provider.setUser(
  'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488',
  PROVIDER_DID
);

provider.addSigningParams(
  'QBFRS+2lb0cKMYdMyxOQYBGBR76gSxZCJlj/1vyy1Z0=', // 302e020100300506032b6570042204204011514beda56f470a31874ccb139060118147bea04b16422658ffd6fcb2d59d encoded in base64
  'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488#did-root-key',
  DID_SIOP.KEY_FORMATS.BASE64,
  DID_SIOP.ALGORITHMS.EdDSA
);

submitButton?.addEventListener('click', () => {
  const request = input!.value;

  console.log(request);

  if (!request) {
    alert('Please enter request value');
    return;
  }

  provider
    .validateRequest(request)
    .then(async (decodedRequest: any) => {
      console.log('decodedRequest', decodedRequest);
      const jwtExpiration = 5000;

      if (
        decodedRequest.payload.claims &&
        decodedRequest.payload.claims.vp_token
      ) {
        // response with vp token
        await provider
          .generateResponseWithVPData(decodedRequest.payload, jwtExpiration, {
            vp_token: {
              proof: {
                type: 'Ed25519Signature2018',
                proofPurpose: 'assertionMethod',
                created: '2021-06-25T02:18:51.000Z',
                verificationMethod:
                  'did:hedera:testnet:6Ra9iBVGxuAfcAYmqibEjmmcBGT5DCZqPSJA8WjhgyNx;hedera:testnet:fid=0.0.78464',
                jws: 'hC44wt5xe8WEIBtlmAW6Vi3YZovpgvjcJ9s31PtDvCezEm07eUmwgL8Uk7KAaKlIfWaSfT66iEYKIaQIV7FZDg',
              },
              verifiableCredential: [
                {
                  proof: {
                    type: 'Ed25519Signature2018',
                    proofPurpose: 'assertionMethod',
                    created: '2021-06-25T02:18:39.000Z',
                    verificationMethod:
                      'did:hedera:testnet:3UehyMhjQNDVWSPHEcpBRfPB5gYLtRxukHfJgV2AwnZn;hedera:testnet:fid=0.0.78464#did-root-key',
                    jws: 'wSuYTVYczyY617PyvDD3oQgUTd_8VknU-Spznj1_GeLHRJF8wVt0KhEj-3RdY1hx5db2hq22t0xR-kKpMXHXDw',
                  },
                  '@context': [
                    'https://www.w3.org/2018/credentials/v1',
                    'https://vc-schemas.meeco.me/credentials/driverLicence/1.0/context.json',
                  ],
                  type: ['VerifiableCredential'],
                  issuer: {
                    id: 'did:hedera:testnet:3UehyMhjQNDVWSPHEcpBRfPB5gYLtRxukHfJgV2AwnZn;hedera:testnet:fid=0.0.78464',
                  },
                  credentialSubject: {
                    additional_name: 'Anne',
                    address: {
                      address_country: 'Australia',
                      address_locality: 'Biggera Waters',
                      address_region: 'QLD',
                      postal_code: '4216',
                      street_address: '346 Pine Ridge',
                    },
                    class: {
                      code: 'C',
                      effective_date: '2020-08-06',
                      expiry_date: '2023-08-05',
                      level: 'L',
                    },
                    conditions: ['S'],
                    date_of_birth: '1982-07-25',
                    extra_info: {
                      doc_type: 'urn:id.gov.au:tdif:doc:type_code:DL.QLD',
                      issuer:
                        'Queensland Department of Transport and Main Roads',
                    },
                    family_name: 'Miller',
                    given_name: 'Jessica',
                    licence_number: '89364218',
                    status: {
                      code: 'CURR',
                      effective_date: '2020-08-06',
                    },
                    type: 'DriverLicenceCredential',
                    id: 'did:hedera:testnet:6Ra9iBVGxuAfcAYmqibEjmmcBGT5DCZqPSJA8WjhgyNx;hedera:testnet:fid=0.0.78464',
                  },
                  issuanceDate: '2021-06-25T02:18:39.000Z',
                  id: 'urn:uuid:56e6e436-5ca4-443c-9a76-211ade86a8ae',
                  expirationDate: '2025-01-24T00:00:00.000Z',
                  credentialSchema: {
                    id: 'https://vc-schemas.meeco.me/credentials/driverLicence/1.0/schema.json',
                    type: 'JsonSchemaValidator2018',
                  },
                },
              ],
              holder:
                'did:hedera:testnet:6Ra9iBVGxuAfcAYmqibEjmmcBGT5DCZqPSJA8WjhgyNx;hedera:testnet:fid=0.0.78464',
              type: ['VerifiablePresentation'],
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              issuanceDate: '2021-06-25T02:18:51.000Z',
              presentation_submission: {
                id: '620344cf-ad2a-419c-84c8-d6f5877971f8',
                definition_id: 'f9fab2f6-9dd1-4fcf-b69c-85795aef87df',
                descriptor_map: [
                  {
                    id: 'DriverLicenceCredential',
                    path: '$.verifiableCredential[0]',
                    format: 'ldp_vc',
                  },
                ],
              },
            },
          })
          .then((siopTokenEncoded: any) => {
            console.log('Response generated ...');
            console.log('siopTokenEncoded', siopTokenEncoded);

            fetch(decodedRequest.payload.redirect_uri, {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
              body: new URLSearchParams({
                siopTokenEncoded: JSON.stringify(siopTokenEncoded),
              }),
            });
          });
      } else {
        await provider
          .generateResponse(decodedRequest.payload, jwtExpiration)
          .then((responseJWT: any) => {
            console.log('Response generated ...');
            console.log('responseJWT', responseJWT);

            fetch(decodedRequest.payload.redirect_uri, {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
              body: new URLSearchParams({
                id_token: responseJWT,
              }),
            });
          });
      }
    })
    .catch(console.error);
  // console.log('decodedRequest', decodedRequest);
});

declare var DID_SIOP: any;
