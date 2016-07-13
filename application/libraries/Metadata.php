<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Metadata{
    
    public $CI;

    public function __construct(){
        $this->CI =& get_instance();
        $this->CI->load->database();
    }

    public function get($item){
        $result = is_numeric($item) ? $this->getById($item) : $this->getByName($item);
        if (!empty($result)){
            return $this->transform($result->file_path, $result->render_xsl);
        }
        return null;
    }

    public function getByType($file_path, $type){
        $this->CI->db->select('render_xsl')
                        ->from('file_type')
                        ->where('type', $type);
        if ($result = $this->CI->db->get()->row()){
            return $this->transform($file_path, $result->render_xsl);
        }
        return null;
    }

    protected function getById($id){
        $this->CI->db->select('file.id, file.title, file.file_path, file_type.render_xsl');
        $this->CI->db->from('file');
        $this->CI->db->join('file_type', 'file_type.id = file.file_type_id', 'left');
        $this->CI->db->where('file.id', $id);
        return $this->CI->db->get()->row();
    }

    protected function getByName($repo_loc){
        $this->CI->db->select('file.id, file.title, file.file_path, file_type.render_xsl');
        $this->CI->db->from('file');
        $this->CI->db->join('file_type', 'file_type.id = file.file_type_id', 'left');
        $this->CI->db->like('file.file_name', $repo_loc.'.', 'after');
        $this->CI->db->where('file.status_type_id', 1);
        $this->CI->db->limit(1);
        return $this->CI->db->get()->row();
    }
    
    protected function transform($file_path, $xsl){
        $output = Array();
        //log_message('debug', var_dump(array($file_path, $xsl)));
        $xslDoc = new DOMDocument();
        $xslDoc->load($this->CI->config->item('xsl_path') . $xsl);

        $xmlDoc = new DOMDocument();
        $xmlDoc->load($file_path);

        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);

        if ($output['value'] = $proc->transformToXML($xmlDoc)){
            if ($xmlDoc->documentElement->lookupnamespaceURI('etd')){
                $output['meta_tags'] = $this->getMetaTags($xmlDoc);
            }
            return $output;
        }
        return null;
    }

    protected function getMetaTags($doc){
        $xslDoc = new DOMDocument();
        $xslDoc->load($this->CI->config->item('xsl_path') . 'etd_meta_tags.xsl');

        $proc = new XSLTProcessor();
        $proc->importStylesheet($xslDoc);

        if ($html = $proc->transformToDoc($doc)){
            $tags = $html->getElementsByTagName('meta');
            $output = Array();
            foreach($tags as $tag){
                $name = '';
                $content = '';
                foreach ($tag->attributes as $attr){
                    $n = $attr->nodeName;
                    $v = $attr->nodeValue;
                    if ($n == 'name'){
                        $name = $v;
                    }
                    else if ($n == 'content'){
                        $content = $v;
                    }
                }
                $output[$name] = $content;
            }
            return $output;
        }
        return null;
    }

}