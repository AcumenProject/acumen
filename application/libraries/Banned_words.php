<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *  BannedWords Class was modified fo Acumen from
 * the Banbuilder PHP script (http://banbuilder.com/) written by snipe (https://github.com/snipe)
 */

class Banned_words {

    public $censorChar;

    private static $badwords;

    function __construct(){
        $this->censorChar = '*';
        self::$badwords = array( 'abortion', 'anal', 'anus', 'ass', 'bastard', 'beastiality', 'bestiality', 'bewb', 'bitch', 'blow', 'blumpkin', 'boob', 'cawk', 'cock', 'choad', 'cooter', 'cornhole', 'cum', 'cunt', 'dick', 'dildo', 'dong', 'dyke', 'douche', 'fag', 'faggot', 'fart', 'foreskin', 'fuck', 'fuk', 'gangbang', 'gook', 'handjob', 'hell', 'homo', 'honkey', 'humping', 'jiz', 'jizz', 'kike', 'kunt', 'labia', 'muff', 'nigger', 'nutsack', 'pen1s', 'penis', 'piss', 'poon', 'poop', 'punani', 'pussy', 'queef', 'queer', 'quim', 'rimjob', 'rape', 'rectal', 'rectum', 'semen', 'sex', 'shit', 'slut', 'spick', 'spoo', 'spooge', 'taint', 'titty', 'titties', 'twat', 'vag', 'vagina', 'vulva', 'wank', 'whore', );
    }


    protected function randCensor($chars, $len) {

        mt_srand(); // useful for < PHP4.2
        $lastChar = strlen($chars) - 1;
        $randOld = -1;
        $out = '';

        // create $len chars
        for ($i = $len; $i > 0; $i--) {
            // generate random char - it must be different from previously generated
            while (($randNew = mt_rand(0, $lastChar)) === $randOld) { }
            $randOld = $randNew;
            $out .= $chars[$randNew];
        }

        return $out;
    }


    public function censor($words) {

        $return = array();
        $num_changes = 0;
        $replacement = $this->buildReplacements();

        // For Transcriptions
        // If STRING is given, preserve original and then create a "clean" copy with the banned words censored
        if (is_string($words)){
            $clean = preg_replace(self::$badwords, $replacement, $words, -1, $num_changes);
            $return['clean'] = $clean;

            if ($num_changes > 0){
                $return['orig'] = $words;
            }
        }
        else{
            // For Tags
            foreach ($words as $word){
                if (preg_replace(self::$badwords, $replacement, $word) == $word){
                    log_message('debug', 'APPROVED: '.preg_replace(self::$badwords, $replacement, $word).' == '.$word);
                    $return['approved'][] = $word;
                }
                else{
                    $return['banned'][] = $word;
                    log_message('debug', 'Banned: '.preg_replace(self::$badwords, $replacement, $word).' != '.$word);
                }
            }
        }

        return $return;
    }

    private function buildReplacements(){

        $leet_replace = array();
        $leet_replace['a']= '(a|a\.|a\-|4|@|Á|á|À|Â|à|Â|â|Ä|ä|Ã|ã|Å|å|α|Δ|Λ|λ)';
        $leet_replace['b']= '(b|b\.|b\-|8|\|3|ß|Β|β)';
        $leet_replace['c']= '(c|c\.|c\-|Ç|ç|¢|€|<|\(|{|©)';
        $leet_replace['d']= '(d|d\.|d\-|&part;|\|\)|Þ|þ|Ð|ð)';
        $leet_replace['e']= '(e|e\.|e\-|3|€|È|è|É|é|Ê|ê|∑)';
        $leet_replace['f']= '(f|f\.|f\-|ƒ)';
        $leet_replace['g']= '(g|g\.|g\-|6|9)';
        $leet_replace['h']= '(h|h\.|h\-|Η)';
        $leet_replace['i']= '(i|i\.|i\-|!|\||\]\[|]|1|∫|Ì|Í|Î|Ï|ì|í|î|ï)';
        $leet_replace['j']= '(j|j\.|j\-)';
        $leet_replace['k']= '(k|k\.|k\-|Κ|κ)';
        $leet_replace['l']= '(l|1\.|l\-|!|\||\]\[|]|£|∫|Ì|Í|Î|Ï)';
        $leet_replace['m']= '(m|m\.|m\-)';
        $leet_replace['n']= '(n|n\.|n\-|η|Ν|Π)';
        $leet_replace['o']= '(o|o\.|o\-|0|Ο|ο|Φ|¤|°|ø)';
        $leet_replace['p']= '(p|p\.|p\-|ρ|Ρ|¶|þ)';
        $leet_replace['q']= '(q|q\.|q\-)';
        $leet_replace['r']= '(r|r\.|r\-|®)';
        $leet_replace['s']= '(s|s\.|s\-|5|\$|§)';
        $leet_replace['t']= '(t|t\.|t\-|Τ|τ)';
        $leet_replace['u']= '(u|u\.|u\-|υ|µ)';
        $leet_replace['v']= '(v|v\.|v\-|υ|ν)';
        $leet_replace['w']= '(w|w\.|w\-|ω|ψ|Ψ)';
        $leet_replace['x']= '(x|x\.|x\-|Χ|χ)';
        $leet_replace['y']= '(y|y\.|y\-|¥|γ|ÿ|ý|Ÿ|Ý)';
        $leet_replace['z']= '(z|z\.|z\-|Ζ)';

        // is $this->censorChar a single char?
        $isOneChar = (strlen($this->censorChar) === 1);

        for ($x=0; $x<count(self::$badwords); $x++) {
            $replacement[$x] = $isOneChar
                ? str_repeat($this->censorChar,strlen(self::$badwords[$x]))
                : $this->randCensor($this->censorChar,strlen(self::$badwords[$x]));
            self::$badwords[$x] =  '/\b'.str_ireplace(array_keys($leet_replace),array_values($leet_replace), self::$badwords[$x]).'\b/i';
        }

        return $replacement;
    }
}