<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?php if(isset($title)) print $title." - "; ?> Acumen - The University of Alabama Libraries' Digital Archives</title>

</head>
<body>
    <?php  foreach($body as $label => $elem): ?>
        <div id="<?php print $label; ?>">
            <h2><?php print $label; ?></h2>
            <?php if ($label === 'asset'): ?>
                <?php if ($elem['type'] == 'image'): ?>
                    <img src="<?php print $elem['asset_path']; ?>" alt="<?php if(isset($title)) print $title; ?>">
                <?php elseif ($elem['type'] == 'video'): ?>
                    <video controls>
                        <source type='video/mp4' src='<?php print $elem['asset_path']; ?>' />
                    </video>
                <?php elseif ($elem['type'] == 'audio'): ?>
                    <audio src="<?php print $elem['asset_path']; ?>" controls></audio>
                <?php else: ?>
                    <a href="<?php print $elem['asset_path']; ?>" title="<?php if(isset($title)) print $title; ?>"><?php if(isset($title)) print $title; ?></a>
                <?php endif; ?>
            <?php elseif(is_array($elem)): ?>
                <?php foreach($elem as $k => $e): ?>
                        <div><?php print $e['value']; ?></div>
                <?php endforeach; ?>
            <?php else: ?>
                <div><?php print $elem; ?></div>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</body>
</html>