import { Lexer } from 'chevrotain';
import { allTokens } from './tokens';

export const lexer = new Lexer(allTokens);
