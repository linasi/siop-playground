import axios from 'axios';
import { DidDocument, Resolvers, RP } from 'did-siop';
import { NextFunction, Request, Response } from 'express';

// RP:
// DID PRIVATE KEY: 302e020100300506032b65700422042064b15d34ec263c60b9b22c804fc65d648aeb2ab422d21bfa075970b09d22f814
// DID PUBLIC KEY: 302a300506032b6570032100a9f0acf233adddae981ed690c43cdb40be4ce82d6466703a8f9b14ed7deea9f8
// did:hedera:testnet:z6MkqtdoR96674Sdu8j22soPJwUETohdC51zbbxFGmFnhqT5_0.0.46045475

const REDIRECT_URL = 'http://localhost:3000/callback';
const DID = 'did:hedera:testnet:z6MkqtdoR96674Sdu8j22soPJwUETohdC51zbbxFGmFnhqT5_0.0.46045475';
const NONCE = 'n-0S6_WzA2Mj';
const STATE = 'af0ifjsldkj';
const VP_REQUEST = {
  state: STATE,
  nonce: NONCE,
  response_mode: 'form_post',
  claims: {
    id_token: {
      email: null,
    },
    vp_token: {
      presentation_definition: {
        id: '16025723-28f9-4917-96df-af341304e604',
        input_descriptors: [
          {
            id: 'IdCredential',
            schema: [
              {
                uri: 'https://vc-schemas.meeco.me/credentials/id/1.0/schema.json',
              },
            ],
            name: 'Identity Credential',
            purpose: 'Identify you as a person',
          },
          {
            id: 'DriverLicenceCredential',
            schema: [
              {
                uri: 'https://vc-schemas.meeco.me/credentials/driverLicence/1.0/schema.json',
              },
            ],
            name: 'QLD Driver Licence - C (Car)',
            purpose: 'Ability to drive a car',
          },
        ],
        name: 'The Government Department',
        purpose: 'Onboarding documentation',
      },
      issuanceDate: '2022-06-01T11:16:50.731Z',
      issuer: 'did:hedera:testnet:7gAbwFg2hi43N9v7awSs3pptTRwA4zNBgrmjfygLW77p;hedera:testnet:fid=0.0.78464',
      recipient: 'sparker@fexpost.com',
    },
    proof: {
      type: 'Ed25519Signature2018',
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:hedera:testnet:7gAbwFg2hi43N9v7awSs3pptTRwA4zNBgrmjfygLW77p;hedera:testnet:fid=0.0.78464',
      signature: 'pg6aeAlFiFAPpd7HGVueYGiZfXmHWzy-rzBTcglhvltza19gUcG62EwMb1G2Rpwt27u3If4JnjjjVEUTtD90CA',
    },
  },
};

/**
 * Universal resolver running locally
 */
class LocalUniResolver extends Resolvers.UniversalDidResolver {
  async resolveDidDocumet(did: string): Promise<DidDocument> {
    const returned = await axios.get('http://localhost:8081/1.0/identifiers/' + did);
    return returned.data.didDocument;
  }
}

class SIOPController {
  private rp: RP = null;

  public request = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rp = await this.getRP();
      const siopRequest = await rp.generateRequest({ state: STATE, nonce: NONCE, response_mode: 'form_post' });

      res.status(201).json({ request: siopRequest });
    } catch (error) {
      next(error);
    }
  };

  public vprequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rp = await this.getRP();
      const siopRequest = await rp.generateRequest(VP_REQUEST);

      res.status(201).json({ request: siopRequest });
    } catch (error) {
      next(error);
    }
  };

  public callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rp = await this.getRP();

      if (req.body.siopTokenEncoded) {
        const response = JSON.parse(req.body.siopTokenEncoded);
        console.log(response);
        const valid = await rp.validateResponseWithVPData(response, { redirect_uri: REDIRECT_URL, isExpirable: true, nonce: NONCE });
        console.log('Response validated ...', valid);

        if (!valid) {
          throw new Error('id_token or vp_token is not valid');
        }

        res.status(201).json({ token: valid, result: 'valid' });
      } else {
        const response = req.body.id_token;
        console.log(response);
        const valid = await rp.validateResponse(response, { redirect_uri: REDIRECT_URL, isExpirable: true, nonce: NONCE });
        console.log('Response validated ...', valid);

        if (!valid) {
          throw new Error('id_token is not valid');
        }

        res.status(201).json({ token: valid, result: 'valid' });
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Helpers
   */

  private async getRP() {
    if (this.rp) {
      return this.rp;
    }

    this.rp = await RP.getRP(REDIRECT_URL, DID, { id_token_signed_response_alg: ['ES256K', 'ES256K-R', 'EdDSA', 'RS256'] }, undefined, [
      new LocalUniResolver('uniresolver'),
    ]);

    this.rp.addSigningParams('ZLFdNOwmPGC5siyAT8ZdZIrrKrQi0hv6B1lwsJ0i+BQ='); // 302e020100300506032b65700422042064b15d34ec263c60b9b22c804fc65d648aeb2ab422d21bfa075970b09d22f814 formated to base64

    return this.rp;
  }
}

export default SIOPController;
