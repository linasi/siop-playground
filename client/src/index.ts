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

      await provider
        .generateResponse(decodedRequest.payload, jwtExpiration)
        .then((responseJWT: any) => {
          console.log('Response generated ...');
          console.log('responseJWT', responseJWT);

          fetch(decodedRequest.payload.redirect_uri, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: new URLSearchParams({
              id_token: responseJWT,
            }),
          });
        });
    })
    .catch(console.error);
  // console.log('decodedRequest', decodedRequest);
});

declare var DID_SIOP: any;
