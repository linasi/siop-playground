import { DidDocument, Provider, Resolvers } from 'did-siop';
import './index.scss';
import { TEST_VP } from './variables';

/**
 * Universal resolver running locally
 */
class LocalUniResolver extends Resolvers.UniversalDidResolver {
  async resolveDidDocumet(did: string): Promise<DidDocument> {
    const data = await fetch(
      'http://localhost:8081/1.0/identifiers/' + did
    ).then((resp) => resp.json());
    return data.didDocument;
  }
}

/**
 * Client app logic
 */
async function main() {
  const input = document.getElementById('siop-request') as HTMLInputElement;
  const submitButton = document.getElementById('submit-response');
  const provider = await Provider.getProvider(
    'did:hedera:testnet:z6MkkasgiWnfK5DGR27Za21sfoxhbQbFPpCrVVCkzA1yNVD3_0.0.46045488',
    undefined,
    [new LocalUniResolver('uniresolver')]
  );

  await provider.addSigningParams(
    'QBFRS+2lb0cKMYdMyxOQYBGBR76gSxZCJlj/1vyy1Z0='
  ); // 302e020100300506032b6570042204204011514beda56f470a31874ccb139060118147bea04b16422658ffd6fcb2d59d encoded in base64

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
            .generateResponseWithVPData(
              decodedRequest.payload,
              jwtExpiration,
              TEST_VP
            )
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
}

main();
