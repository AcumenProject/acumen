<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Transcribe {

    public $transcript;

    function __construct() {
        // Light spam prevention
        // - Check to see is hidden "honey pot" comment field was filled in
        // - Check if the HTTP_REFERER is from this server
        /*if (!empty($_REQUEST['human'])){
            exit;
        }*/
        $this->CI =& get_instance();
        $this->CI->load->database();
    }

    public function approveTranscript($transcript){
        $this->CI->load->library('banned_words');
        $this->transcript = $this->CI->banned_words->censor($transcript);
        //$banned = new BannedWords();
        //$this->transcript = $banned->censor($transcript);
    }

    public function getTranscriptsByAsset($asset_name) {
        $transcript = array();
        $q = "SELECT id, status, timestamp, value FROM transcripts WHERE asset_name=? AND status >= -1 ORDER BY status DESC, timestamp DESC LIMIT 1";
        //$result = self::$db->query_results("SELECT id, status, timestamp, value FROM transcripts WHERE asset_name='$asset_name' AND status >= 0 ORDER BY timestamp, status DESC LIMIT 1");
        $result = $this->CI->db->query($q, array($asset_name));
        if ($result->num_rows() > 0){
            foreach ($result->result_array() as $row){
                if ($row['status'] == -1){
                    $row['isOCR'] = true;
                }
                $transcript[] = $row;
            }
        }
        /*else{
            $base_path = $this->CI->config->item('acumen_base_path');

            $rel_path = preg_replace ( '/_/', '/', $asset_name ) . '/Transcripts/' . $asset_name . '.ocr.txt';
            $path = $base_path . '/content/' . $rel_path;

            if (file_exists ( $path )) {
                $transcript[] = array(
                    'isOCR' => true,
                    'value' => utf8_encode(file_get_contents ($path))
                );
            }
        }*/
        return $transcript;
    }

    public function addTranscript($transcript, $asset_name){
        $this->approveTranscript($transcript);
        if (!empty($this->transcript['orig'])){
            $this->insertTranscript($this->transcript['orig'], $asset_name, -2);
        }
        $this->insertTranscript($this->transcript['clean'], $asset_name, 0);
    }

    public function insertTranscript($transcript, $asset_name, $status){
        //$t = mysql_real_escape_string($transcript);
        //self::$db->query("INSERT INTO transcripts (asset_name, status, value) VALUES ('$asset_name', $status, '$t')");
        $this->CI->db->insert('transcripts', array('asset_name' => $asset_name, 'status' => $status, 'value' => $transcript));
    }


}

/*class TranscriptAdmin extends Transcription {

    function __construct(){
        parent::__construct();
    }

    public function updateStatus($id, $status){
        self::$db->query("UPDATE transcripts SET status=$status WHERE id=$id");
    }

    public function verify($id){
        $this->updateStatus($id, 1);
    }

    public function reject($id){
        $this->updateStatus($id, -2);
    }

    public function revert($id, $asset_name){
        $revert_query = "DELETE FROM transcripts WHERE"
            ." asset_name='$asset_name'"
            ." AND timestampe > (SELECT timestamp FROM transcripts WHERE id=$id)";
        self::$db->query($revert_query);
    }

    protected function getTranscripts(){
        $query = "SELECT"
            ." f0.title as title,"
            ." f0.file_name as file_name,"
            ." f1.title as parent_title,"
            ." GROUP_CONCAT(DISTINCT a.thumb_path, a.name, '_2048.jpg') as thumb,"
            ." t.value as transcript,"
            ." t.asset_name as asset_name"
            ." cs.value as status"
            ." FROM transcripts as t"
            ." JOIN crowd_status as cs ON t.status = cs.id"
            ." JOIN asset as a ON t.asset_name = a.name"
            ." JOIN file as f0 ON a.file_id = f0.id"
            ." JOIN file as f1 ON f0.parent_id = f1.id"
            ." WHERE t.timestamp = (SELECT max(timestamp) FROM transcripts WHERE asset_name=t.asset_name)"
            ." GROUP BY a.name"
            ." LIMIT 0, 10";
        $transcripts = parent::$db->query_results($query);
        return $transcripts;
    }

    protected function getByCollection($repo_loc){

    }

    protected function getByStatus($status){

    }

}*/