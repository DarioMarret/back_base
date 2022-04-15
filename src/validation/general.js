import { check } from 'express-validator'
import { validateResul } from '../helper/validateHelper';


export const uservalidar = [
    check("usuario").exists().not().isEmpty().isString(),
    check("contracena").exists().not().isEmpty().isString(),
    check("whatsapp").exists().not().isEmpty().isString(),
    check("empresa").exists().not().isEmpty().isString(),
    (req, res, next) => {
      validateResul(req, res, next);
    },
  ];