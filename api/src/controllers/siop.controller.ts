import axios from 'axios';
import { ALGORITHMS, DidDocument, KEY_FORMATS, Resolvers, RP } from 'did-siop';
import { NextFunction, Request, Response } from 'express';

// RP:
// DID PRIVATE KEY: 302e020100300506032b65700422042064b15d34ec263c60b9b22c804fc65d648aeb2ab422d21bfa075970b09d22f814
// DID PUBLIC KEY: 302a300506032b6570032100a9f0acf233adddae981ed690c43cdb40be4ce82d6466703a8f9b14ed7deea9f8
// did:hedera:testnet:z6MkqtdoR96674Sdu8j22soPJwUETohdC51zbbxFGmFnhqT5_0.0.46045475

const REDIRECT_URL = 'http://localhost:3000/callback';
const DID = 'did:hedera:testnet:z6MkqtdoR96674Sdu8j22soPJwUETohdC51zbbxFGmFnhqT5_0.0.46045475';

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
      const siopRequest = await rp.generateRequest();

      res.status(201).json({ request: siopRequest });
    } catch (error) {
      next(error);
    }
  };

  public callback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rp = await this.getRP();

      if (!req.body.id_token) {
        throw new Error('id_token param is missing');
      }

      console.log(req.body.id_token);

      const valid = await rp.validateResponse(req.body.id_token);
      console.log('Response validated ...', valid);

      if (!valid) {
        throw new Error('id_token token is not valid');
      }

      res.status(201).json({ id_token: req.body.id_token, result: 'valid' });
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

    this.rp.addSigningParams(
      'ZLFdNOwmPGC5siyAT8ZdZIrrKrQi0hv6B1lwsJ0i+BQ=', // 302e020100300506032b65700422042064b15d34ec263c60b9b22c804fc65d648aeb2ab422d21bfa075970b09d22f814 formated to base64
      'did:hedera:testnet:z6MkqtdoR96674Sdu8j22soPJwUETohdC51zbbxFGmFnhqT5_0.0.46045475#did-root-key',
      KEY_FORMATS.BASE64,
      ALGORITHMS.EdDSA,
    );

    return this.rp;
  }
}

export default SIOPController;
