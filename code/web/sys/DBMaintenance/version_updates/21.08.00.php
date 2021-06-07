<?php
/** @noinspection PhpUnused */
function getUpdates21_08_00() : array
{
	return [
		'library_archive_permission' => [
			'title' => 'Fix Library Archive Permission name',
			'description' => 'Fix library archive permission',
			'continueOnError' => true,
			'sql' => [
				"UPDATE permissions set name = 'Library Archive Options' where name = 'Library Open Archive Options'",
				"INSERT INTO role_permissions(roleId, permissionId) VALUES ((SELECT roleId from roles where name  = 'opacAdmin'), (SELECT id from permissions where name='Library Archive Options'))",
				"INSERT INTO role_permissions(roleId, permissionId) VALUES ((SELECT roleId from roles where name  = 'libraryAdmin'), (SELECT id from permissions where name='Library Archive Options'))",
			]
		], //upload_list_cover_permissions
	];
}