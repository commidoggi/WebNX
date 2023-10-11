import { CallbackError, MongooseError } from 'mongoose'
import handleError from '../config/handleError.js'
import PartRecord from '../model/partRecord.js'
import { PartRecordSchema, AssetSchema, PalletSchema } from '../app/interfaces.js'
import Asset from '../model/asset.js'
import Pallet from '../model/pallet.js'
import { Response } from 'express'

const callbackHandler = {
    updateRecord: (err: CallbackError, record: any) => {
        if (err) {
            return handleError(err)
        }
        PartRecord.findByIdAndUpdate(record.prev, { next: record._id, date_replaced: record.date_created, next_owner: record.owner }, (err: MongooseError, record: PartRecordSchema) => {
            if (err) {
                return handleError(err)
            }
        })
    },
    updateAsset: (err: CallbackError, record: AssetSchema) => {
        if (err) {
            return handleError(err)
        }
        if(record.prev!=null)
            Asset.findByIdAndUpdate(record.prev, { next: record._id, date_replaced: record.date_created, next_pallet: record.pallet }, (err: MongooseError, rec: AssetSchema) => {
            if (err) {
                return handleError(err)
            }
        })
    },
    updateAssetAndReturn: (res: Response) =>{
        return (err: CallbackError, record: AssetSchema) => {
            if (err) {
                res.status(500).send("API could not handle your request: "+err);
                return handleError(err)
            }
            if(record.prev!=null)
                Asset.findByIdAndUpdate(record.prev, { next: record._id, date_replaced: record.date_created, next_pallet: record.pallet }, (err: MongooseError, rec: AssetSchema) => {
                    if (err) {
                        res.status(500).send("API could not handle your request: "+err);
                        return handleError(err)
                    }
                    res.status(200).send("Success")
                })
            else
                res.status(200).send("Success")
        }
    },
    updatePalletAndReturn: (res: Response) =>{
        return (err: CallbackError, record: PalletSchema) => {
            if (err) {
                res.status(500).send("API could not handle your request: "+err);
                return handleError(err)
            }
            if(record.prev!=null)
                Pallet.findByIdAndUpdate(record.prev, { next: record._id, date_replaced: record.date_created }, (err: MongooseError, rec: PalletSchema) => {
                    if (err) {
                        res.status(500).send("API could not handle your request: "+err);
                        return handleError(err)
                    }
                    res.status(200).send("Success")
                })
            else
                res.status(200).send("Success")
        }
    },
    callbackHandleError: (err: CallbackError, record: any) => {
        if (err) {
            return handleError(err)
        }
    }
}

export default callbackHandler
