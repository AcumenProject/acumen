<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Metadata_model extends CI_Model{

    public $id;
    public $file = array();
    public $metadata;


    public function __construct(){
        parent::__construct();
        $this->load->database();
        $this->load->helper('acumen');
    }

    public function get($_item, $get_rank = false){
        $item = is_numeric($_item) ? $this->getById($_item) : $this->getByName($_item);
        if ($item){
            $this->file = array(
                'id' => $this->id,
                'type' => $item->type,
                'title' => $item->title,
                'file_path' => file_to_web_path($item->file_path),
                'size' => $item->file_size,
                'last_modified' => $item->last_modified,
                'children' => $this->getNumChildren($this->id)
            );
            if ($get_rank){
                $this->file['rank'] = $this->getRank($this->id, $item->parent_id);
            }

            $this->file['parent'] = $this->getParentInfo($item->parent_id);

            $xsl = $this->getXSL($item->type);
            if ($xsl){
                if ($metadata = $this->transform($item->file_path, $xsl)){
                    $this->metadata = $metadata;
                }
                else{
                    $this->metadata = 'XSL Transform Failed';
                }
            }
            else{
                $this->metadata = "Acumen is not familiar with this type of metadata";
            }
        }
    }

    public function getById($id){
        $this->id = $id;
        $this->db->select('f.parent_id as parent_id, f.title as title, f.file_path as file_path, f.file_last_modified as last_modified, f.file_size as file_size, ft.type as type')
            ->from('file as f')
            ->join('file_type as ft', 'f.file_type_id = ft.id', 'left')
            ->where('f.id', $id)
            ->where('status_type_id', 1)->where('found', 1);
        return $this->db->get()->row();
    }

    public function getByName($name){
        $this->db->select('id')->from('file')->like('file_name', $name.'.', 'after')->where('status_type_id', 1)->where('found', 1)->limit(1);
        $r = $this->db->get()->row();
        if ($r){
            return $this->getById($r->id);
        }
        return FALSE;
    }

    public function getParentInfo($parent_id){
        $info = array('id' => $parent_id);
        if ($parent_id > 0){
            $this->db->select('title, file_name as link')->from('file')->where('id', $parent_id);
            $r = $this->db->get()->row_array();
            $r['link'] = preg_replace('/_/', '/', strip_file_ext($r['link']));
            $info = array_merge($info, $r);
        }
        return $info;
    }

    public function getRank($id, $parent_id){
        $this->db->select('rank')->from('(SELECT @rownum:=@rownum+1 rank, f.* FROM file f, (SELECT @rownum:=0) r WHERE f.status_type_id=1 AND parent_id='.$parent_id.' ORDER BY f.file_name) s')->where('id', $id);
        $r = $this->db->get()->row_array();
        return $r['rank'];
    }

    public function getNumChildren($id){
        $this->db->select('count(id) as count')->from('file')->where('parent_id', $id)->where('status_type_id', 1);
        $metadata = $this->db->get()->row();

        $this->db->select('count(id) as count')->from('asset')->where('file_id', $id)->where('status_type_id', 1);
        $asset = $this->db->get()->row();

        return array(
            'assets' => $asset->count,
            'metadata' => $metadata->count
        );
    }

    public function getXSL($type){
        $this->db->select('render_xsl')->from('file_type')->where('type', $type);
        $xsl = $this->db->get()->row();
        return $xsl->render_xsl;

    }

    protected function transform($file_path, $xsl){
        if (file_exists($file_path)){
            $xmlDoc = new DOMDocument();
            $xmlDoc->load($file_path);
            $xslDoc = new DOMDocument();
            $xslDoc->load($this->config->item('xsl_path') . $xsl);

            $proc = new XSLTProcessor();
            $proc->importStylesheet($xslDoc);

            if ($output = $proc->transformToXML($xmlDoc)){
                return $output;
            }
        }
        return null;
    }

}