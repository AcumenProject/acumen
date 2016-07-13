<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once('Searcher.php');

Class Solr_searcher extends Searcher {

    public $limit = 20;
	public $solr_params = array();

	protected $level_labels = array();
	
	public function __construct(){
		parent::__construct();	
		$this->CI->load->library('solr');

        $this->solr_params = array(
            'defType' => 'edismax',
            'fq' => '',
			'bq' => array(
				'{!edismax qf=title^200 mm=75% v=$q bq=}',
				'{!edismax qf=subject^100 mm=100% v=$q bq=}',
				'{!edismax qf=genre^100 mm=100% v=$q bq=}',
				'{!edismax qf=collection^50 mm=75% v=$q bq=}',
				'{!edismax qf=date mm=100% v=$q bq=}',
				'{!edismax qf=physdesc mm=100% v=$q bq=}',
				'{!edismax qf=name^150 mm=100% v=$q bq=}'
			),
            'qf' => 'textAll', //'title^4 tag^3.5 transcript^3.5 subject^2 abstract^2 description^2 creator^2 date date_start date_end collection genre archivist',
            'fl' => 'title_s description_s abstract_s subject_s genre_s repo_loc collection_s tag transcript_s type tags thumb_path asset_type date date_end date_start display_date localbroad id link_type parent_loc parent_id',
            'mm' => '100%',
            'pf' => 'transcript abstract description',
            'ps' => '7'
        );

		//TODO: replicated from Items_searcher.php to safe time - Merge functionality to one class.
		$this->level_labels = array(
			array(
				'audio' => 'Track',
				'video' => 'Clip',
				'image' => 'Page',
				'document' => 'Page'
			),
			array(
				'audio' => 'Sub-track',
				'video' => 'Sub-clip',
				'image' => 'Sub-page',
				'document' => 'Sub-page'
			)
		);
	}
	
	/**
	 * Get search result
	 * @param String $q - query string
	 * @param Array $params - local search and solr params
	 * 		Expected Structure:
	 * 			Array(
	 * 				'start' => INT //document offset for results
	 * 				'limit' => INT //limit number of documents returned
	 * 				'category' => STRING //optional to fetch preconfigure category query filter
	 * 				'SOLR_PARAM' => VAL //Append any addition Solr params (e.g., fl, qf, defType, etc...)
	 * 			)
	 * @param Boolean $json - set TRUE to return results as json
	 */
	public function search($params = array()){

		$this->_process_params($params);
		$results = $this->CI->solr->search($this->q, $this->start, $this->limit, $this->params);

		$r = $this->_process_results($results);

		return $r;
	}
	
	/**
	 * Process the params array to fit searching syntax
	 * @param Array $params
	 * 		Ex: Array(
	 * 					'query' => STRING
	 * 					'category => PRESET_FILTER_QUERY_ID //Optional - the array key for the filter queries in config->acumen->search['categories']
	 * 					'start' => INT //document offset for results
	 *	 				'limit' => INT //limit number of documents returned
	 *					'SOLR_PARAM' => VAL //Append any addition Solr params (e.g., fl, qf, defType, etc...)
	 *				)
	 */
	public function _process_params($params){

        // Process page (stored as $this->start) and limit params from parent method
        parent::_process_params($params);
		foreach ($params as $param => $val){

            $query = html_entity_decode(urldecode(utf8_decode($val)));
            switch ($param) {
                case 'q':
                    $this->q = $query;
                    break;
                case 'fl':
                    if (preg_match('/\bid\b/', $query) == 0) {
                         $query .= ' id';
                    }
                    if (preg_match('/\brepo_loc\b/', $query) == 0) {
                        $query .= ' repo_loc';
                    }
                    $this->params[$param] = $query;
                    break;
                default:
                    $this->params[$param] = $query;
                    break;
            }
		}
		$this->params = array_filter(array_merge($this->solr_params, $this->params));

	}

    // Adopted from - http://www.php.net/manual/en/solrutils.escapequerychars.php#112864
    public function _escape_query_chars($query){
        // Lucene characters that need escaping with \ are + - && || ! ( ) { } [ ] ^ " ~ * ? : \
        $luceneReservedCharacters = preg_quote('+-&|!(){}[]^"~*?:\\');
        $query = preg_replace_callback(
            '/([' . $luceneReservedCharacters . '])/',
            function($matches) {
                return '\\' . $matches[0];
            },
            $query);
        return $query;
    }
	
	private function _process_solr_params($params){
		if (!empty($params['category'])){
			$cat = $params['category'];
			unset($params['category']);
		}
		else{
			$cat = $this->search['selected'];
		}
		
		$this->solr_params['fq'] = $this->search['categories'][$cat]['fq'];
		$this->solr_params = array_merge($this->solr_params, $params);
	}
	
	private function _process_results($r){
		$processed = array();
		$processed['numFound'] = (int) $r->response->numFound;
		$processed['queryTime'] = (double) ($r->responseHeader->QTime/1000);
		
		foreach ($r->response->docs as $key => $docs){
			$results = array();
			foreach ($docs as $field => $val){
				switch ($field){
	
					case 'description_s':
					case 'abstract_s':
					case 'transcript_s':
						if (!isset($results['description'])){
							$results['description'] = isset($docs->description_s) ? $docs->description_s : (isset($docs->abstract_s) ? $docs->abstract_s : $docs->transcript_s);
                            if (is_array($results['description'])) $results['description'] = $results['description'][0];
						}
						break;
							
					case 'title_s':
						if (is_array($docs->title_s)){
							$results['title'] = $docs->title_s[0];
							$results['sub_title'] = implode(',', array_slice($docs->title_s,0));
						}
						else{
							$results['title'] = $docs->title_s;
						}
						break;
	
					case 'display_date':
						if (strpos($val, ";")){
							$dates = explode(";", $val);
							$start = $dates[0];
							$end = array_pop($dates);
							$results['date'] = $start.'-'.$end;
							unset($dates);
						}
						else{
							$results['date'] = $val;
						}
						break;
	
					case 'date':
						if (is_array($val)){
							$results['date'] = $val[0];
							if (count($val) == 2 && strlen($val[0]) <= 4){
								$results['date'] .= '-'.$val[1];
							}
						}
						break;

					case 'repo_loc':
						$results['link'] = preg_replace('/_/', '/', $val);
						break;

					case 'collection_s':
						$results['collection'] = is_array($val) ? $val : array($val);
						break;
	
					case 'genre_s':
						$results['details']['genre'] = is_array($val) ? $val : array($val);
						break;
	
					case 'tag':
						$results['details']['tag'] = is_array($val) ? $val : array($val);
						break;
	
					case 'subject_s':
						$results['details']['subject'] = is_array($val) ? $val : array($val);
						break;
	
					case 'asset_type':
						$results['asset_type'] = $val;
						break;
                    default:
                        $label = substr_compare($field, '_s', -2, 2) === 0 ? substr($field, 0, -2) : $field;
                        $results[$label] = is_array($val) ? $val : array($val);
                        break;
				}
			}
			//Repo locations at the collection level have no assets
			//as direct children, thus they have no "thumb_path" field in
			//the Solr index. Thus we perform this outside of the switch
			//so that all displayed records have thumbnails

			$thumb_path = isset($docs->link_type) ? $this->_get_thumb($docs->link_type, $docs->repo_loc, $docs->thumb_path) : $this->_find_thumb($docs->id); //lazily send parent ID if it's onyl an asset. TODO: change the _fund_thumb() function.
			if ($thumb_path){
				$results['thumb_path'] = $thumb_path;
				$results['has_thumb'] = TRUE;
			}
			else{
				if ($this->_intersects($docs->asset_type, array_keys($this->default_thumbnail))){
					$results['thumb_path'] = $this->CI->config->base_url().$this->default_thumbnail[$docs->asset_type];
				}
				else if(isset($docs->type)){
					if (preg_match('/record|sound|audio/i', $docs->type)){
						$results['thumb_path'] = $this->CI->config->base_url().$this->default_thumbnail['audio'];
					}
					else{
						$results['thumb_path'] = $this->CI->config->base_url().$this->default_thumbnail['Archived Collection'];
					}
				}
			}

			//TODO: replicated from Items_searcher.php to safe time - Merge functionality to one class.
			//Last minute check, to be sure there is a title
			if (empty($results['title'])){
				if (isset($docs->link_type)){
					$level = substr_count($docs->repo_loc, '_') - 3; // 3 being the offset count of item position in the repo_loc
					$arr = explode('_', $docs->repo_loc);
					$num = ltrim(array_pop($arr), '0');

					$title = $this->level_labels[$level];

						$title = $title[$docs->link_type];

					$title .= ' '.$num;

					$this->CI->load->database();
					$q = $this->CI->db->query("SELECT title FROM file WHERE id = ".$docs->parent_id);

					if ($q->num_rows() != 0){
						$parent = $q->result_array();
						$title = $parent[0]['title'].', '.$title;
					}
					$results['title'] = $title;
				}
				else{
					$results['title'] = 'Title N/A';
				}
			}

			//Pass the new array for this record to the main results array
			$processed['docs'][$key] = $results;
		}
		return $processed;
	}

	private function _intersects($array1, $array2){
		if (!is_array($array1)){
			$array1 = array($array1);
		}
		foreach ($array1 as $a1){
			foreach ($array2 as $a2){
				if ($a1 == $a2){
					return true;
				}
			}
		}
		return false;
	}
}