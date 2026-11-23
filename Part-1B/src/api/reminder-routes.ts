import {Router} from 'express'; import {validateRequest} from './request-validation'; import {interpret} from '../domain/reminder-interpreter'; import {buildPrompt} from '../llm/prompt-builder'; import {callModel} from '../llm/llm-client'; import {parseModelJson} from '../llm/response-parser'; import {validateInterpretation} from '../validation/output-schema'; import {config} from '../config';
export const reminderRouter=Router();
reminderRouter.post('/interpret',async(req,res,next)=>{
  try{
    const request=validateRequest(req.body);
    if(config.mode==='deterministic') return res.json(interpret(request));
    const raw=await callModel(buildPrompt(request));
    return res.json(validateInterpretation(parseModelJson(raw)));
  }catch(e){return next(e)}
});
